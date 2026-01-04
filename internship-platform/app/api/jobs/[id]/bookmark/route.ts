import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const dynamic = "force-dynamic"; 


function getBearer(req: Request) {
  const h = req.headers.get('authorization');
  if (!h) return null;
  const [t, token] = h.split(' ');
  return t?.toLowerCase() === 'bearer' ? token : null;
}

function getJobId(req: Request, params?: { jobId?: string }) {
  let id = params?.jobId;
  if (!id) {
    const segs = new URL(req.url).pathname.split('/').filter(Boolean);
    id = segs.at(-2);
  }
  if (!id || id === 'undefined' || id === 'null') return null;
  return id;
}

async function getStudentId(token: string) {
  const auth = createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });

  const { data } = await auth.auth.getUser();
  if (!data.user) return null;

  const admin = createClient(url, service, { auth: { persistSession: false } });
  const { data: user } = await admin
    .from('User')
    .select('id')
    .eq('provider_uid', data.user.id)
    .eq('role', 'STUDENT')
    .eq('is_active', true)
    .single();

  return user?.id ?? null;
}

export async function GET(req: Request, { params }: { params: { jobId: string } }) {
  try {
    const token = getBearer(req);
    if (!token) {
      return NextResponse.json({ bookmarked: false }, { status: 200 }); // ← Không cần 401
    }

    const jobId = getJobId(req, params);
    if (!jobId) {
      return NextResponse.json({ bookmarked: false }, { status: 400 });
    }

    const studentId = await getStudentId(token);
    if (!studentId) {
      return NextResponse.json({ bookmarked: false }, { status: 200 }); // ← Không cần 403
    }

    const admin = createClient(url, service); 
    const { data, error } = await admin
      .from('StudentBookmark')
      .select('id')
      .eq('student_id', studentId)
      .eq('job_id', jobId)
      .maybeSingle();

    console.log('GET Bookmark check:', { 
      studentId, 
      jobId, 
      hasData: !!data,
      error: error?.message 
    });
    return NextResponse.json({ 
      bookmarked: !!data,  
      success: true 
    });

  } catch (err) {
    console.error("GET bookmark error:", err);
    return NextResponse.json({ bookmarked: false, success: false }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { jobId?: string } }) {
  try {
    const token = getBearer(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const jobId = getJobId(req, params);
    if (!jobId) return NextResponse.json({ error: 'Invalid job id' }, { status: 400 });

    const studentId = await getStudentId(token);
    if (!studentId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const admin = createClient(url, service);
    const { error } = await admin.from('StudentBookmark').upsert(
      { student_id: studentId, job_id: jobId },
      { onConflict: 'student_id,job_id' }
    );

    if (error) {
      console.error('POST bookmark error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('POST Bookmark saved:', { studentId, jobId });

    return NextResponse.json({ success: true, bookmarked: true });
  } catch (err) {
    console.error("POST bookmark error:", err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { jobId?: string } }) {
  try {
    const token = getBearer(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const jobId = getJobId(req, params);
    if (!jobId) return NextResponse.json({ error: 'Invalid job id' }, { status: 400 });

    const studentId = await getStudentId(token);
    if (!studentId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const admin = createClient(url, service);
    const { error } = await admin
      .from('StudentBookmark')
      .delete()
      .eq('student_id', studentId)
      .eq('job_id', jobId);

    if (error) {
      console.error('DELETE bookmark error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('DELETE Bookmark removed:', { studentId, jobId });

    return NextResponse.json({ success: true, bookmarked: false });
  } catch (err) {
    console.error("DELETE bookmark error:", err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}