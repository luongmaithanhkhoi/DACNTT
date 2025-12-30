import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/enterprises/:id - Lấy chi tiết doanh nghiệp
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
        jobs:JobPosting(
          id,
          title,
          location,
          is_open,
          created_at
        ),
        users:EnterpriseUser(
          user_id,
          full_name,
          position,
          user:User(email, avatar_url)
        )
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

    return NextResponse.json({ success: true, data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi server'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

// PUT /api/enterprises/:id - Cập nhật doanh nghiệp
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { name, description, industry, image_url } = body

    const { data, error } = await supabase
      .from('Enterprise')
      .update({
        name,
        description,
        industry,
        image_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi server'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}




// DELETE /api/enterprises/:id - Xóa doanh nghiệp
export async function DELETE(
    request: NextRequest,
    context: { params: { id: string } }
) {
  try {
    const { id } = await context.params
    const { error } = await supabase
      .from('Enterprise')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Đã xóa doanh nghiệp'
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi server'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}