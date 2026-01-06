import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const {
      title,
      description,
      start_date,
      end_date,
      status,
      positions_available,
      max_participants,
      location,
      required_skills,
      category_id,
      location_id,
    } = await req.json();

    const { data, error } = await supabase
      .from("Event")
      .update({
        title,
        description,
        start_date,
        end_date,
        status,
        positions_available,
        max_participants,
        location,
        required_skills,
        category_id,
        location_id,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating event:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
      try {
        const { id } = params;
    
        const { data, error } = await supabase
          .from("Event")
          .delete()
          .eq("id", id);
    
        if (error) {
          console.error("Error deleting event:", error);
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
    
        return NextResponse.json({ success: true, message: "Event deleted successfully" });
      } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
      }
    }