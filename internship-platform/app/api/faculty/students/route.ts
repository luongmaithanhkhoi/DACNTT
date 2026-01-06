import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    const major = searchParams.get("major") || null;
    const graduationYear = searchParams.get("graduation_year") || null;
    const internshipStatus = searchParams.get("internship_status") || null;
    const orderBy = searchParams.get("order_by") || "full_name";
    const orderDir = searchParams.get("order_dir") || "asc";

    const sb = createClient(url, anon);

    let query = sb
      .from("Student")
      .select("*")
      .range(offset, offset + limit - 1)
      .order(orderBy, { ascending: orderDir === "asc" });

    if (major) {
      query = query.ilike("major", `%${major}%`);
    }
    if (graduationYear) {
      query = query.eq("graduation_year", graduationYear);
    }
    if (internshipStatus) {
      query = query.eq("internship_status", internshipStatus);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({
      total: count ?? 0,
      items: data,
      page: { limit, offset, order_by: orderBy, order_dir: orderDir },
    });
  } catch (e) {
    console.error("Error fetching students:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
