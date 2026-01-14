import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const toInt = (v: string | null, d = 10) => {
  const n = Number(v ?? "");
  return !Number.isFinite(n) || n <= 0 ? d : Math.floor(n);
};

const clean = (s: string | null) => {
  if (!s) return null;
  const t = s.trim();
  return t === "" || t === "undefined" || t === "null" ? null : t;
};


const ORDERABLE = new Set([
  "start_date",
  "end_date",
  "created_at",
  "updated_at",
  "title",
]);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = clean(searchParams.get("q"));
    const status = clean(searchParams.get("status"));              
    const categoryId = clean(searchParams.get("category_id"));   
    const location = clean(searchParams.get("location"));
    const from = clean(searchParams.get("from"));                  
    const to = clean(searchParams.get("to"));                      
    const tag = clean(searchParams.get("tag"));                   

    const limit = Math.min(toInt(searchParams.get("limit"), 10), 200);
    const offset = Math.max(0, Number(searchParams.get("offset") ?? 0) || 0);

    const orderByRaw = clean(searchParams.get("order_by")) || "start_date";
    const orderBy = ORDERABLE.has(orderByRaw) ? orderByRaw : "start_date";
    const orderDir =
      (clean(searchParams.get("order_dir")) || "asc").toLowerCase() === "desc"
        ? "desc"
        : "asc";

    const sb = createClient(SB_URL, ANON, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    let query = sb
      .from("Event") 
      .select(
        `
        id,
        title,
        description,
        start_date,
        end_date,
        status,
        location,
        category_id,
        created_at,
        updated_at
      `,
        { count: "exact" }
      )
      .order(orderBy as any, { ascending: orderDir === "asc" })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq("status", status);
    if (categoryId) query = query.eq("category_id", categoryId);
    if (location) query = query.ilike("location", `%${location}%`);

    if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);

    if (from) query = query.gte("start_date", from);
    if (to) {
      query = query.lte("start_date", to);
    }

    const { data: baseEvents, error: baseErr, count } = await query;
    if (baseErr) {
      return NextResponse.json({ error: baseErr.message }, { status: 400 });
    }

    if (!tag) {
      return NextResponse.json({
        total: count ?? 0,
        items: baseEvents ?? [],
        page: { limit, offset, order_by: orderBy, order_dir: orderDir },
      });
    }

    const { data: tagRows, error: tagErr } = await sb
      .from("Tag")
      .select("id")
      .eq("name", tag)
      .limit(1);

    if (tagErr) return NextResponse.json({ error: tagErr.message }, { status: 400 });

    const tagId = tagRows?.[0]?.id;
    if (!tagId) {
      return NextResponse.json({ total: 0, items: [], page: { limit, offset } });
    }

    const eventIds = (baseEvents ?? []).map((e: any) => e.id);
    if (eventIds.length === 0) {
      return NextResponse.json({ total: 0, items: [], page: { limit, offset } });
    }

    const { data: eventTag, error: etErr } = await sb
      .from("EventTag")
      .select("event_id")
      .eq("tag_id", tagId)
      .in("event_id", eventIds);

    if (etErr) return NextResponse.json({ error: etErr.message }, { status: 400 });

    const allowed = new Set((eventTag ?? []).map((x: any) => x.event_id));
    const filtered = (baseEvents ?? []).filter((e: any) => allowed.has(e.id));

    return NextResponse.json({
      total: filtered.length,
      items: filtered,
      page: { limit, offset, order_by: orderBy, order_dir: orderDir },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
