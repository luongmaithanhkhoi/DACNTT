import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// helper parse int/bool safely
const toInt = (v: string | null, def = 10) => {
  const n = Number(v ?? "");
  return Number.isFinite(n) && n >= 0 ? n : def;
};
const toBool = (v: string | null) =>
  v === "true" ? true : v === "false" ? false : null;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || null;
    const location = searchParams.get("location")?.trim() || null;
    const industry = searchParams.get("industry")?.trim() || null;
    const skillId = searchParams.get("skill_id")?.trim() || null;
    const minAllowance = searchParams.get("min_allowance")?.trim() || null;
    const workMode = searchParams.get("work_mode")?.trim() || null; // ONSITE|HYBRID|REMOTE
    const empType = searchParams.get("employment_type")?.trim() || null; // INTERN|...
    const isOpen = toBool(searchParams.get("is_open"));
    const limit = toInt(searchParams.get("limit"), 10);
    const offset = toInt(searchParams.get("offset"), 0);
    const orderBy = searchParams.get("order_by") || "application_deadline"; // hoặc created_at
    // ✅ thêm 2 params đúng với frontend
    const locationId = searchParams.get("location_id")?.trim() || null;
    const categoryId = searchParams.get("category_id")?.trim() || null;

    // (tuỳ chọn) vẫn support filter theo tên location nếu bạn còn dùng input text
    const locationName = searchParams.get("location")?.trim() || null;
    const orderDir =
      (searchParams.get("order_dir") || "desc").toLowerCase() === "asc"
        ? "asc"
        : "desc";

    // Client “ẩn danh” là đủ vì đây là endpoint public để SV duyệt job
    const sb = createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Chọn cột + embed liên quan
    // Lưu ý: dùng !inner cho JobSkill khi lọc theo skill để ép inner join
    const baseSelect = `
  id, title, description, internship_period, require_gpa_min, is_open, category_id,
  application_deadline, allowance_min, allowance_max, work_mode, job_type, tags, created_at,
  Enterprise:Enterprise(id, name, industry, location, address, image_url),
  Location:Location(id, name, code),
  JobSkill:JobSkill(${
    skillId ? "!inner" : ""
  }skill_id, required_level, Skill:Skill(id, name))
`;

    let query = sb
      .from("JobPosting")
      .select(baseSelect, { count: "exact" })
      .range(offset, offset + limit - 1)
      .order(orderBy as string, { ascending: orderDir === "asc" });

    if (q) {
      // ưu tiên FTS nếu bạn đã tạo idx (đã có idx_jobposting_fts)
      query = query.textSearch("title", q, { type: "plain" }); // đơn giản; có thể mở rộng: or(title,description)
    }
    if (locationId) {
      query = query.eq("location_id", locationId);
    } else if (locationName) {
      // fallback nếu vẫn dùng filter theo tên
      query = query.ilike("Location.name", `%${locationName}%`);
    }
    
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }
    if (isOpen !== null) query = query.eq("is_open", isOpen);
    if (minAllowance) query = query.gte("allowance_min", Number(minAllowance));

    if (workMode) query = query.eq("work_mode", workMode);
    if (empType) query = query.eq("job_type", empType);

    if (industry) {
      // lọc bằng industry của Enterprise (filter trên embed)
      query = query.eq("Enterprise.industry", industry);
    }

    if (skillId) {
      // lọc job yêu cầu skill nhất định (inner join ở select đã đảm bảo chỉ lấy job match)
      query = query.eq("JobSkill.skill_id", skillId);
    }

    const { data, error, count } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const items = (data ?? []).map((row: any) => ({
      ...row,
      location: row.Location?.name ?? row.Enterprise?.location ?? null,
      employment_type: row.job_type ?? null,
    }));

    return NextResponse.json({
      total: count ?? 0,
      items,
      page: { limit, offset, order_by: orderBy, order_dir: orderDir },
    });
  } catch (e: unknown) {
    console.error("GET /api/jobs error", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
