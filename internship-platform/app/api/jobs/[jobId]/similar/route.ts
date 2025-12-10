import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Lấy jobId an toàn: ưu tiên params, fallback tách từ URL: /api/jobs/<id>/similar
function extractJobId(req: Request, params?: { jobId?: string }) {
  let id = params?.jobId;
  if (!id) {
    const segs = new URL(req.url).pathname.split('/').filter(Boolean);
    // segs = ["api","jobs","<id>","similar"]
    const idx = segs.indexOf('jobs');
    if (idx >= 0 && segs.length > idx + 1) id = segs[idx + 1];
  }
  if (!id || id === 'undefined' || id === 'null' || id === 'similar') return null;
  return id;
}

export async function GET(req: Request, ctx: { params: { jobId?: string } }) {
  const jobId = extractJobId(req, ctx.params);
  if (!jobId) return NextResponse.json({ error: 'Invalid job id' }, { status: 400 });

  try {
    const sb = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });

    // 1) Job gốc
    const { data: seed, error: seedErr } = await sb
      .from('JobPosting')
      .select('id, location, tags, Enterprise(industry)')
      .eq('id', jobId)
      .single();
    if (seedErr || !seed) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

    // 2) Ứng viên
    let qy = sb
      .from('JobPosting')
      .select(`
        id, title, description, location, is_open, application_deadline, tags,
        Enterprise:Enterprise(id, name, industry)
      `)
      .neq('id', jobId)
      .eq('is_open', true)
      .limit(50);

    const industry = (seed as any)?.Enterprise?.industry as string | undefined;
    if (industry) qy = qy.eq('Enterprise.industry', industry);
    if (Array.isArray((seed as any).tags) && (seed as any).tags.length) {
      qy = qy.overlaps('tags', (seed as any).tags as string[]);
    }

    const { data: candidates, error } = await qy;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // 3) Scoring đơn giản
    const seedTags = new Set<string>(Array.isArray((seed as any).tags) ? (seed as any).tags : []);
    const scored = (candidates ?? [])
      .map((j: any) => {
        const tags = new Set<string>(Array.isArray(j.tags) ? j.tags : []);
        let overlap = 0; for (const t of tags) if (seedTags.has(t)) overlap++;
        const sameIndustry = j.Enterprise?.industry === industry ? 1 : 0;
        const sameLocation = j.location === (seed as any).location ? 1 : 0;
        const score = overlap * 2 + sameIndustry * 1.5 + sameLocation * 1;
        return { score, ...j };
      })
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 10);

    return NextResponse.json({ items: scored });
  } catch (e) {
    console.error('GET /api/jobs/[jobId]/similar error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
