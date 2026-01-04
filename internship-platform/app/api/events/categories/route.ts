import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // Dùng SERVICE_ROLE để bypass RLS khi cần (chỉ chạy server)
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TABLE = "event_categories";

// Whitelist cột order_by để tránh inject
const ORDERABLE = new Set(["created_at", "name", "slug"]);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? 50), 1), 200);
    const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);

    const order_by = searchParams.get("order_by") ?? "name";
    const order_dir = (searchParams.get("order_dir") ?? "asc").toLowerCase();

    const q = (searchParams.get("q") ?? "").trim();

    const orderCol = ORDERABLE.has(order_by) ? order_by : "name";
    const ascending = order_dir !== "desc";

    let query = supabase
      .from(TABLE)
      .select("id,name,slug,created_at", { count: "exact" })
      .order(orderCol, { ascending })
      .range(offset, offset + limit - 1);

    // search theo name/slug
    if (q) {
      // ilike = case-insensitive
      query = query.or(`name.ilike.%${q}%,slug.ilike.%${q}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      total: count ?? 0,
      items: data ?? [],
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
