import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: Request) {
  try {
    const sb = createClient(SB_URL, ANON, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: events, error, count } = await sb
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
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      total: count ?? 0,
      items: events ?? [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
