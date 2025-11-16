import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const svc = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function extractJobId(req: Request, params?: { jobId?: string | undefined }) {
  
  // ưu tiên params từ Next
  let id = params?.jobId;
  if (!id) {
    // fallback: tự tách từ pathname
    // /api/jobs/:id/bookmark  => id nằm ở segment áp chót
    const segs = new URL(req.url).pathname.split("/").filter(Boolean);
    id = segs.at(-2) || undefined;
  }
  if (!id) return undefined;
  const t = id.trim();
  return t === "" || t === "undefined" || t === "null" ? null : t;
}

function getBearer(req: Request) {
  const h =
    req.headers.get("authorization") || req.headers.get("Authorization") || "";
  const [t, token] = h.split(" ");
  return t?.toLowerCase() === "bearer" ? token : null;
}
function cleanId(id?: string | null) {
  if (!id) return null;
  const t = id.trim();
  return t === "" || t === "undefined" || t === "null" ? null : t;
}

async function getAppUserIdFromToken(token: string) {
  const authSb = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: u, error } = await authSb.auth.getUser();
  if (error || !u?.user) return null;

  const admin = createClient(url, svc, { auth: { persistSession: false } });
  const { data: app, error: appErr } = await admin
    .from("User")
    .select("id, role, is_active")
    .eq("provider_uid", u.user.id)
    .single();
  if (appErr || !app || app.role !== "STUDENT" || !app.is_active) return null;
  return app.id as string;
}

export async function POST(
  req: Request,
  { params }: { params: { jobId?: string } }
) {
  try {
    const token = getBearer(req);
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const jobId = extractJobId(req, params); // <--- dùng extractor mới
    if (!jobId)
      return NextResponse.json({ error: "Invalid job id" }, { status: 400 });

    const studentId = await getAppUserIdFromToken(token);
    if (!studentId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const admin = createClient(url, svc, { auth: { persistSession: false } });
    const { error } = await admin
      .from("StudentBookmark")
      .upsert({ student_id: studentId, job_id: jobId });
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /jobs/[jobId]/bookmark error:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { jobId?: string } }
) {
  try {
    const token = getBearer(req);
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const jobId = extractJobId(req, params); // <--- dùng extractor mới
    if (!jobId)
      return NextResponse.json({ error: "Invalid job id" }, { status: 400 });

    const studentId = await getAppUserIdFromToken(token);
    if (!studentId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const admin = createClient(url, svc, { auth: { persistSession: false } });
    const { error } = await admin
      .from("StudentBookmark")
      .delete()
      .eq("student_id", studentId)
      .eq("job_id", jobId);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /jobs/[jobId]/bookmark error:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
