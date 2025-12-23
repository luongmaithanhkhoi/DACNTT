import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(url, anon)

export async function GET() {
  try {
    /**
     * Lấy id của Vietnam trước
     */
    const { data: country, error: countryError } = await supabase
      .from('Location')
      .select('id')
      .eq('code', 'VN')
      .single()

    if (countryError || !country) {
      return NextResponse.json(
        { message: 'Country VN not found' },
        { status: 404 }
      )
    }

    /**
     * Lấy danh sách city
     */
    const { data: locations, error } = await supabase
      .from('Location')
      .select('id, name, code')
      .eq('parent_id', country.id)
      .order('name')

    if (error) {
      throw error
    }

    return NextResponse.json(locations)
  } catch (error) {
    console.error('GET /api/locations error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}
