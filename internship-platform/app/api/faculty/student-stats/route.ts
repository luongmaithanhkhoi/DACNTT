import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const major = searchParams.get("major");
    const graduationYear = searchParams.get("graduation_year");

    // Xây dựng câu truy vấn cơ bản
    let query = supabase
      .from("Student")
      .select("major, graduation_year, count(*)", { count: "exact" })
      .select("major, graduation_year, count:count(*)");

    // Nếu có ngành học, thêm điều kiện lọc
    if (major) {
      query = query.ilike("major", `%${major}%`);
    }

    // Nếu có năm tốt nghiệp, thêm điều kiện lọc
    if (graduationYear) {
      query = query.eq("graduation_year", parseInt(graduationYear));
    }

    // Thực hiện truy vấn
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching student stats:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Trả về kết quả thống kê
    return NextResponse.json({
      success: true,
      data: data || [],
      message: "Thống kê sinh viên thành công",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ success: false, error: "Lỗi server" }, { status: 500 });
  }
}
