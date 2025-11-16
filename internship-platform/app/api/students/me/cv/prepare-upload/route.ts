import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'node:crypto'
import { getBearer, getStudentAppUserFromToken } from '@/lib/api-auth'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const svc  = process.env.SUPABASE_SERVICE_ROLE_KEY!
const BUCKET = 'documents'  // hoặc 'cv' nếu bạn tạo bucket khác tên

type Body = {
  content_type?: string  // mặc định 'application/pdf'
  ext?: string           // 'pdf','docx'
}

export async function POST(req: Request) {
  try {
    const token = getBearer(req)
    if (!token) return NextResponse.json({ error: 'Missing Bearer token' }, { status: 401 })

    const { admin, appUser } = await getStudentAppUserFromToken(token)
    const body = (await req.json().catch(() => ({}))) as Body

    const ext = (body.ext || 'pdf').replace(/[^a-z0-9]/gi, '').toLowerCase()
    const ct  = body.content_type || (ext === 'docx'
      ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      : 'application/pdf')

    // object path: documents/<user_id>/cv-<timestamp>-<uuid>.<ext>
    const objectPath = `${appUser.id}/cv-${Date.now()}-${crypto.randomUUID()}.${ext}`

    const { data, error } = await admin.storage
      .from(BUCKET)
      .createSignedUploadUrl(objectPath)

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'createSignedUploadUrl failed' }, { status: 400 })
    }

    return NextResponse.json({
      bucket: BUCKET,
      path: objectPath,     // -> sau upload, PATCH /students/me { cv_url: "documents/<...>" }
      upload_url: data.signedUrl,
      token: data.token,
      content_type: ct
      // không trả public_url vì bucket private
    })
  } catch (e: any) {
    const msg = e?.message || 'Internal Server Error'
    const code = msg === 'AUTH_INVALID' ? 401
              : msg === 'APP_USER_NOT_FOUND' ? 404
              : msg === 'FORBIDDEN_ROLE' ? 403
              : msg === 'INACTIVE' ? 403 : 500
    return NextResponse.json({ error: msg }, { status: code })
  }
}
