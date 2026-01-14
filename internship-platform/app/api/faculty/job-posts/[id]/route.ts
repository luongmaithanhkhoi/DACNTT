import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const { status } = await req.json();  

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const sb = createClient(url, anon);

    // Cập nhật trạng thái bài đăng
    const { data, error } = await sb
      .from("JobPosting")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error("Error updating job post status:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
