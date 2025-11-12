import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ADMIN_SECRET = process.env.ADMIN_PROVISION_SECRET!

type CreateUserBody = {
  email: string
  password: string
  role: 'STUDENT' | 'ENTERPRISE' | 'FACULTY' | 'ADMIN'
  // optional profile fields
  full_name?: string
  major?: string
  enterprise_id?: string
}

export async function POST(req: Request) {
  try {
    // 0) Check admin secret
    const secret = req.headers.get('x-admin-secret')
    if (!secret || secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = (await req.json()) as CreateUserBody
    if (!body?.email || !body?.password || !body?.role) {
      return NextResponse.json({ error: 'email/password/role required' }, { status: 400 })
    }

    // 1) Create Supabase Auth user (email/password)
    const adminAuth = createClient(url, service, { auth: { persistSession: false } })
    const { data: created, error: createErr } = await adminAuth.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: { role: body.role }
    })
    if (createErr || !created?.user) {
      return NextResponse.json({ error: createErr?.message ?? 'create user failed' }, { status: 400 })
    }
    const authId = created.user.id

    // 2) Map vào bảng ứng dụng "User"
    const { data: appUser, error: appUserErr } = await adminAuth
      .from('User')
      .insert({
        email: body.email,
        provider_uid: authId,
        role: body.role,
        is_active: true
      })
      .select('id, role')
      .single()

    if (appUserErr || !appUser) {
      return NextResponse.json({ error: appUserErr?.message ?? 'insert app user failed' }, { status: 400 })
    }

    // 3) Nếu role = STUDENT → tạo dòng Student; nếu ENTERPRISE → tạo EnterpriseUser
    if (body.role === 'STUDENT') {
      const { error: stuErr } = await adminAuth
        .from('Student')
        .insert({
          user_id: appUser.id,
          full_name: body.full_name ?? null,
          major: body.major ?? null
        })
      if (stuErr) {
        return NextResponse.json({ error: stuErr.message }, { status: 400 })
      }
    } else if (body.role === 'ENTERPRISE') {
      if (!body.enterprise_id) {
        return NextResponse.json({ error: 'enterprise_id required for ENTERPRISE role' }, { status: 400 })
      }
      const { error: entErr } = await adminAuth
        .from('EnterpriseUser')
        .insert({
          user_id: appUser.id,
          enterprise_id: body.enterprise_id
        })
      if (entErr) {
        return NextResponse.json({ error: entErr.message }, { status: 400 })
      }
    }

    return NextResponse.json({
      ok: true,
      auth_user_id: authId,
      app_user_id: appUser.id,
      role: appUser.role
    })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
