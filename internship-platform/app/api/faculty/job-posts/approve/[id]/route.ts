import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(url, anon);

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params; 

    console.log("Job ID from URL:", id);  

    if (!id) {
      return NextResponse.json({ success: false, error: "jobId is missing" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("JobPosting")
      .update({ status: "APPROVED" })
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi server";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
