import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(url, anon);

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Dùng await để giải quyết Promise của params
    const { id } = await params; // Dùng await ở đây

    console.log("Job ID from URL:", id);  // Để kiểm tra

    if (!id) {
      return NextResponse.json({ success: false, error: "jobId is missing" }, { status: 400 });
    }

    // Cập nhật trạng thái công việc từ "PENDING" thành "APPROVED"
    const { data, error } = await supabase
      .from("JobPosting")
      .update({ status: "REJECTED" })
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi server";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
