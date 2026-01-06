import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    const orderBy = searchParams.get("order_by") || "created_at";
    const orderDir = searchParams.get("order_dir") || "desc";
    const status = searchParams.get("status") || "PENDING";  // Trạng thái PENDING mặc định

    const sb = createClient(url, anon);

    // Lấy danh sách bài đăng cần duyệt với trạng thái PENDING
    const { data, error, count } = await sb
      .from("JobPosting")
      .select("*", { count: "exact" })
      .eq("status", status) // lọc bài đăng theo trạng thái
      .range(offset, offset + limit - 1)
      .order(orderBy, { ascending: orderDir === "asc" });

    if (error) throw error;

    return NextResponse.json({
      total: count ?? 0,
      items: data,
      page: { limit, offset, order_by: orderBy, order_dir: orderDir },
    });
  } catch (e) {
    console.error("Error fetching job posts:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
