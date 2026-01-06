import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const eventType = searchParams.get("event_type");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    const orderBy = searchParams.get("order_by") || "start_date";

    let query = supabase
      .from("Event")
      .select("*")
      .range(offset, offset + limit - 1)
      .order(orderBy, { ascending: true });

    if (status) query = query.eq("status", status);
    if (eventType) query = query.eq("event_type", eventType);
    if (startDate) query = query.gte("start_date", startDate);
    if (endDate) query = query.lte("end_date", endDate);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching events:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data,
      pagination: {
        total: count || 0,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      title,
      description,
      start_date,
      end_date,
      event_type = "OTHER",
      status = "DRAFT",
      positions_available,
      max_participants,
      location,
      required_skills,
      category_id,
      location_id,
    } = await req.json();

    const { data, error } = await supabase
      .from("Event")
      .insert([
        {
          title,
          description,
          start_date,
          end_date,
          event_type,
          status,
          positions_available,
          max_participants,
          location,
          required_skills,
          category_id,
          location_id,
          creator_id: "YOUR_CREATOR_ID",  // Đảm bảo rằng bạn truyền creator_id
        },
      ]);

    if (error) {
      console.error("Error creating event:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
