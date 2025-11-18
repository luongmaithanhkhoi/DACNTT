import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/enterprises - Lấy danh sách doanh nghiệp
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const industry = searchParams.get('industry')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let query = supabase
      .from('Enterprise')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter theo industry
    if (industry) {
      query = query.eq('industry', industry)
    }

    // Tìm kiếm theo tên
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi server'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

// POST /api/enterprises - Tạo doanh nghiệp mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, industry, image_url } = body

    // Validate
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Thiếu tên doanh nghiệp' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('Enterprise')
      .insert({
        name,
        description,
        industry,
        image_url
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi server'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}