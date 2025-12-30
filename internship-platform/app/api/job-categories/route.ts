// app/api/job-categories/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('JobCategory')
      .select('id, name, code, icon')
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('API /api/job-categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi tải danh mục công việc' },
      { status: 500 }
    );
  }
}