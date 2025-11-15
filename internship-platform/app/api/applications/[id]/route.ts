// app/api/applications/[id]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SVC = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getBearer(req: Request) {
  const h = req.headers.get("authorization") || "";
  const [t, token] = h.split(" ");
  return t?.toLowerCase() === "bearer" ? token : null;
}

function getIdSafely(req: Request, params?: { id?: string }) {
  // ưu tiên params do Next cung cấp
  let id = params?.id;
  if (!id) {
    // fallback: lấy từ URL path
    const segs = new globalThis.URL(req.url).pathname
      .split("/")
      .filter(Boolean);
    // .../api/applications/<id>
    if (segs.length >= 3) id = segs[segs.length - 1];
  }
  if (!id) return null;
  const t = id.trim();
  return t === "" || t === "undefined" || t === "null" ? null : t;
}

/** GET /api/applications/[id] — public detail (không bắt buộc login) */
export async function GET(req: Request, ctx: { params: { id?: string } }) {
  try {
    const id = getIdSafely(req, ctx.params);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const sb = createClient(SB_URL, ANON, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await sb
      .from("Application")
      .select(
        `
    id, status, note, created_at, updated_at,
    cover_letter, cv_url, cv_document_id, portfolio_urls, answers,
    contact_email, contact_phone, preferred_start_date, availability_note,
    expected_allowance, profile_snapshot,
    JobPosting:JobPosting(
      id, title, location, is_open, application_deadline,
      Enterprise:Enterprise(id, name, industry, image_url)
    )
  `
      )
      .eq("id", id)
      .maybeSingle();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ item: data });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

type PatchBody = { action: "withdraw" } | { note: string };

/** PATCH /api/applications/[id] — SV chủ đơn được sửa note/withdraw */
export async function PATCH(req: Request, ctx: { params: { id?: string } }) {
  try {
    const token = getBearer(req);
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = getIdSafely(req, ctx.params);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const body = (await req.json().catch(() => ({}))) as PatchBody;

    // map token -> app user id
    const authSb = createClient(SB_URL, ANON, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: u, error: uErr } = await authSb.auth.getUser();
    if (uErr || !u?.user)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const admin = createClient(SB_URL, SVC, {
      auth: { persistSession: false },
    });
    const { data: appUser, error: appErr } = await admin
      .from("User")
      .select("id, role, is_active")
      .eq("provider_uid", u.user.id)
      .single();
    if (
      appErr ||
      !appUser ||
      appUser.role !== "STUDENT" ||
      !appUser.is_active
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Chỉ cho chủ đơn thao tác
    const { data: appRow, error: findErr } = await admin
      .from("Application")
      .select("id, student_id, status")
      .eq("id", id)
      .single();
    if (findErr || !appRow)
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    if (appRow.student_id !== appUser.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if ("action" in body && body.action === "withdraw") {
      // hiện tại enum chưa có WITHDRAWN → xoá bản ghi để rút đơn
      const { error: delErr } = await admin
        .from("Application")
        .delete()
        .eq("id", id);
      if (delErr)
        return NextResponse.json({ error: delErr.message }, { status: 400 });
      return NextResponse.json({ ok: true, deleted: true });
    }

    if ("note" in body) {
      const { data, error } = await admin
        .from("Application")
        .update({ note: body.note })
        .eq("id", id)
        .select("id, status, note, updated_at")
        .single();
      if (error)
        return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true, item: data });
    }

    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
