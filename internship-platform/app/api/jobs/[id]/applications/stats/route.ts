import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/jobs/:id/applications/stats
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params

    const { data, error } = await supabase
      .from('Application')
      .select('status')
      .eq('job_id', id)

    if (error) throw error

    const stats = {
      total: data?.length || 0,
      pending: data?.filter(a => a.status === 'PENDING').length || 0,
      approved: data?.filter(a => a.status === 'APPROVED').length || 0,
      rejected: data?.filter(a => a.status === 'REJECTED').length || 0,
      reviewing: data?.filter(a => a.status === 'REVIEWING').length || 0
    }

    return NextResponse.json({
      success: true,
      message: 'Lấy thống kê thành công',
      data: stats
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi server'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
