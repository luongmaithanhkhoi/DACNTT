import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type EnterpriseInfo = {
  id: string;
  name?: string | null;
  industry?: string | null;
};

type JobPosting = {
  id: string;
  title?: string;
  description?: string;
  location?: string | null;
  is_open?: boolean;
  application_deadline?: string | null;
  tags?: string[] | null;
  Enterprise?: EnterpriseInfo | null;
};

export async function GET(
  _req: Request,
  { params }: { params: { jobId?: string } }
) {
  const jobId = params?.jobId;
  if (!jobId || jobId === "undefined" || jobId === "null") {
    return NextResponse.json({ error: "Invalid job id" }, { status: 400 });
  }

  try {
    const sb = createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 1) Lấy job gốc
    const { data: seed, error: seedErr } = await sb
      .from("JobPosting")
      .select("id, location, tags, Enterprise(industry)")
      .eq("id", jobId)
      .single<JobPosting>();

    if (seedErr || !seed) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // 2) Query các job ứng viên
    let query = sb
      .from("JobPosting")
      .select(
        `
          id, title, description, location, is_open, application_deadline, tags,
          Enterprise:Enterprise(id, name, industry)
        `
      )
      .neq("id", jobId)
      .eq("is_open", true)
      .limit(50);

    const industry = seed.Enterprise?.industry ?? null;
    if (industry) query = query.eq("Enterprise.industry", industry);

    if (Array.isArray(seed.tags) && seed.tags.length > 0) {
      query = query.overlaps("tags", seed.tags);
    }

    const { data: candidates, error } = await query.returns<JobPosting[]>();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 3) Tính điểm tương tự
    const seedTags = new Set(seed.tags ?? []);
    const scored = (candidates ?? [])
      .map((j) => {
        const jobTags = new Set(j.tags ?? []);
        let overlap = 0;
        for (const t of jobTags) if (seedTags.has(t)) overlap++;
        const sameIndustry = j.Enterprise?.industry === industry ? 1 : 0;
        const sameLocation = j.location === seed.location ? 1 : 0;

        const score = overlap * 2 + sameIndustry * 1.5 + sameLocation * 1;
        return { score, ...j };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return NextResponse.json({ items: scored });
  } catch (e: unknown) {
    console.error("GET /api/jobs/[jobId]/similar error", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
