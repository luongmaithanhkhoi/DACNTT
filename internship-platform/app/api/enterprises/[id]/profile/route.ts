import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/enterprises/:id/profile - Lấy profile
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params
    
    const { data, error } = await supabase
      .from('Enterprise')
      .select(`
        *,
        jobs:JobPosting(count),
        users:EnterpriseUser(count)
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy doanh nghiệp' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Lấy profile thành công',
      data
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi server'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

// PUT /api/enterprises/:id/profile - Cập nhật profile
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    const { data, error } = await supabase
      .from('Enterprise')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Cập nhật profile thành công',
      data
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi server'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}