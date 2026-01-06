// import { NextResponse } from "next/server";
// import { z } from "zod";
// import { supabase } from "@/lib/supabaseClient";
// import { supabaseServer } from "@/lib/supabaseServer";

// const schema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
//   role: z.enum(["STUDENT", "ENTERPRISE"]).default("STUDENT"),
//   full_name: z.string().optional(),
//   major: z.string().optional(),
// });

// export async function POST(req: Request) {
//   try {
//     // 0) Kiểm tra env rõ ràng để tránh 500 khó hiểu
//     if (
//       !process.env.NEXT_PUBLIC_SUPABASE_URL ||
//       !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
//     ) {
//       return NextResponse.json(
//         { error: "Missing Supabase URL/ANON KEY" },
//         { status: 500 }
//       );
//     }
//     if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
//       return NextResponse.json(
//         { error: "Missing SUPABASE_SERVICE_ROLE_KEY" },
//         { status: 500 }
//       );
//     }

//     const body = schema.parse(await req.json());

//     // 1) Tạo user ở Supabase Auth bằng anon key
//     const { data: signUp, error: signErr } = await supabase.auth.signUp({
//       email: body.email,
//       password: body.password,
//     });
//     if (signErr)
//       return NextResponse.json({ error: signErr.message }, { status: 400 });

//     // Nếu đang bật email confirmation, session có thể null — báo rõ
//     const authUser = signUp.user!;

//     const { data: userRow, error: uErr } = await supabaseServer
//       .from("User")
//       .upsert(
//         {
//           id: authUser.id, // map thẳng auth.users.id
//           email: authUser.email,
//           role: body.role, // 'STUDENT' | 'ENTERPRISE'
//           is_active: true,

//           // >>> QUAN TRỌNG: thêm 2 dòng này <<<
//           provider: "supabase",
//           provider_uid: authUser.id, // nếu cột là uuid: để nguyên; nếu text: vẫn OK
//         },
//         { onConflict: "id" } // hoặc onConflict: 'provider,provider_uid'
//       )
//       .select()
//       .single();

//     if (uErr)
//       return NextResponse.json({ error: uErr.message }, { status: 400 });

//     // Nếu là student → upsert Student
//     if (body.role === "STUDENT") {
//       const { error: sErr } = await supabaseServer.from("Student").upsert(
//         {
//           user_id: userRow.id, // = User.id = authUser.id
//           full_name: body.full_name ?? null,
//           major: body.major ?? null,
//         },
//         { onConflict: "user_id" }
//       );
//       if (sErr)
//         return NextResponse.json({ error: sErr.message }, { status: 400 });
//     }

//     // 3) Trả kết quả
//     return NextResponse.json(
//       {
//         user: { id: userRow.id, email: userRow.email, role: userRow.role },
//         session: signUp.session ?? null,
//       },
//       { status: 201 }
//     );
//   } catch (e: any) {
//     console.error("SIGNUP_ERROR:", e); // xem ở terminal dev server
//     // Zod/JSON parse lỗi → 400; còn lại → 500
//     const message = e?.issues?.[0]?.message || e?.message || "Sign-up error";
//     const status = e?.issues ? 400 : 500;
//     return NextResponse.json({ error: message }, { status });
//   }
// }


// app/api/auth/signup/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient'; // client anon key
import { createClient } from '@supabase/supabase-js';

const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service key để bypass RLS
);

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự'),
  role: z.enum(['STUDENT', 'ENTERPRISE']).default('STUDENT'),
  full_name: z.string().optional(),
  major: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // Kiểm tra env
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Missing Supabase config' }, { status: 500 });
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Missing service role key' }, { status: 500 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }
    const { email, password, role, full_name, major } = parsed.data;

    // 1. Tạo user trong Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: { role }, // gửi role qua metadata (tùy chọn)
      },
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Không thể tạo user' }, { status: 500 });
    }

    const authUserId = authData.user.id;

    // 2. Tạo record trong bảng User (dùng service key để bypass RLS)
    const { data: appUser, error: userError } = await supabaseService
      .from('User')
      .upsert(
        {
          id: authUserId,
          provider_uid: authUserId,
          email: email.toLowerCase().trim(),
          role,
          is_active: true,
          avatar_url: null,
        },
        { onConflict: 'id' } // hoặc 'provider_uid'
      )
      .select('id, role')
      .single();

    if (userError) {
      console.error('Insert User error:', userError);
      return NextResponse.json({ error: 'Không thể tạo hồ sơ người dùng' }, { status: 500 });
    }

    // 3. Nếu là STUDENT → tạo record trong bảng Student
    if (role === 'STUDENT') {
      const { error: studentError } = await supabaseService
        .from('Student')
        .upsert(
          {
            user_id: appUser.id,
            full_name: full_name || null,
            major: major || null,
          },
          { onConflict: 'user_id' }
        );

      if (studentError) {
        console.error('Insert Student error:', studentError);
        // Không return error – vẫn cho đăng ký thành công
      }
    }

    // 4. Nếu là ENTERPRISE → có thể tạo Enterprise record ở đây hoặc ở trang riêng

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.',
      user: {
        id: appUser.id,
        email: authData.user.email,
        role: appUser.role,
      },
      session: authData.session, // có thể null nếu cần confirm email
    });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json(
      { error: 'Lỗi server khi đăng ký' },
      { status: 500 }
    );
  }
}