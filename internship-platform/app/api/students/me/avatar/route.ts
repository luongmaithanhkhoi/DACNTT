import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'node:crypto'
import { getBearer, getStudentAppUserFromToken } from '@/lib/api-auth'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const svc  = process.env.SUPABASE_SERVICE_ROLE_KEY!
const BUCKET = 'avatars'

type Body = {
  content_type?: string  // ví dụ 'image/png','image/jpeg'
  ext?: string           // 'png','jpg'...
}

export async function POST(req: Request) {
  try {
    const token = getBearer(req)
    if (!token) return NextResponse.json({ error: 'Missing Bearer token' }, { status: 401 })

    const { admin, appUser } = await getStudentAppUserFromToken(token)
    const body = (await req.json().catch(() => ({}))) as Body

    const ext = (body.ext || 'png').replace(/[^a-z0-9]/gi, '').toLowerCase()
    const ct  = body.content_type || (ext === 'jpg' ? 'image/jpeg' : `image/${ext}`)

    // object path: avatars/<user_id>/<uuid>.<ext>
    const objectPath = `${appUser.id}/${crypto.randomUUID()}.${ext}`

    // Tạo signed upload URL (client sẽ PUT file bytes lên URL này)
    const { data, error } = await admin.storage
      .from(BUCKET)
      .createSignedUploadUrl(objectPath)

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'createSignedUploadUrl failed' }, { status: 400 })
    }

    // Lấy public URL để hiển thị ảnh sau khi upload
    const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(objectPath)

    return NextResponse.json({
      bucket: BUCKET,
      path: objectPath,
      upload_url: data.signedUrl,
      token: data.token,           // nếu cần dùng SDK upload
      content_type: ct,
      public_url: pub.publicUrl    // lưu vào Student.avatar_url hoặc User.avatar_url
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
