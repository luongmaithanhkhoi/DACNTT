import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";
import { supabaseServer } from "@/lib/supabaseServer";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["STUDENT", "ENTERPRISE"]).default("STUDENT"),
  full_name: z.string().optional(),
  major: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // 0) Kiểm tra env rõ ràng để tránh 500 khó hiểu
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return NextResponse.json(
        { error: "Missing Supabase URL/ANON KEY" },
        { status: 500 }
      );
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Missing SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      );
    }

    const body = schema.parse(await req.json());

    // 1) Tạo user ở Supabase Auth bằng anon key
    const { data: signUp, error: signErr } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
    });
    if (signErr)
      return NextResponse.json({ error: signErr.message }, { status: 400 });

    // Nếu đang bật email confirmation, session có thể null — báo rõ
    const authUser = signUp.user!;

    const { data: userRow, error: uErr } = await supabaseServer
      .from("User")
      .upsert(
        {
          id: authUser.id, // map thẳng auth.users.id
          email: authUser.email,
          role: body.role, // 'STUDENT' | 'ENTERPRISE'
          is_active: true,

          // >>> QUAN TRỌNG: thêm 2 dòng này <<<
          provider: "supabase",
          provider_uid: authUser.id, // nếu cột là uuid: để nguyên; nếu text: vẫn OK
        },
        { onConflict: "id" } // hoặc onConflict: 'provider,provider_uid'
      )
      .select()
      .single();

    if (uErr)
      return NextResponse.json({ error: uErr.message }, { status: 400 });

    // Nếu là student → upsert Student
    if (body.role === "STUDENT") {
      const { error: sErr } = await supabaseServer.from("Student").upsert(
        {
          user_id: userRow.id, // = User.id = authUser.id
          full_name: body.full_name ?? null,
          major: body.major ?? null,
        },
        { onConflict: "user_id" }
      );
      if (sErr)
        return NextResponse.json({ error: sErr.message }, { status: 400 });
    }

    // 3) Trả kết quả
    return NextResponse.json(
      {
        user: { id: userRow.id, email: userRow.email, role: userRow.role },
        session: signUp.session ?? null,
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("SIGNUP_ERROR:", e); // xem ở terminal dev server
    // Zod/JSON parse lỗi → 400; còn lại → 500
    const message = e?.issues?.[0]?.message || e?.message || "Sign-up error";
    const status = e?.issues ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
