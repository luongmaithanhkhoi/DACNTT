// app/api/enterprise/events/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(' ');
  return scheme?.toLowerCase() === 'bearer' ? token : null;
}

async function getEnterpriseId(token: string): Promise<string | null> {
  const authClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return null;

  const { data: appUser } = await supabaseAdmin
    .from('User')
    .select('id')
    .eq('provider_uid', user.id)
    .single();

  if (!appUser) return null;

  const { data: link } = await supabaseAdmin
    .from('EnterpriseUser')
    .select('enterprise_id')
    .eq('user_id', appUser.id)
    .single();

  return link?.enterprise_id || null;
}
export async function POST(req: Request) {
  try {
    const token = getBearerToken(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const enterpriseId = await getEnterpriseId(token);
    if (!enterpriseId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();

    const {
      title,
      description,
      start_date,
      end_date,
      event_type = 'OTHER',
      status = 'PENDING',
      positions_available,
      max_participants,
      location,
      required_skills,
      tags = [],
    } = body;

    if (!title) return NextResponse.json({ error: 'Tiêu đề là bắt buộc' }, { status: 400 });

    // LẤY APP USER ID (User.id) TỪ TOKEN
    const authClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user } } = await authClient.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { data: appUser, error: userError } = await supabaseAdmin
      .from('User')
      .select('id')
      .eq('provider_uid', user.id)
      .single();

    if (userError || !appUser) {
      return NextResponse.json({ error: 'Không tìm thấy user trong hệ thống' }, { status: 404 });
    }

    const creatorId = appUser.id; // ← ĐÚNG ID ĐỂ INSERT

    // Insert event
    const { data: event, error: eventError } = await supabaseAdmin
      .from('Event')
      .insert({
        creator_id: creatorId, // ← SỬA Ở ĐÂY
        title,
        description,
        start_date: start_date || null,
        end_date: end_date || null,
        event_type,
        status,
        positions_available: positions_available ? parseInt(positions_available) : null,
        max_participants: max_participants ? parseInt(max_participants) : null,
        location: location || null,
        required_skills: required_skills || null,
      })
      .select('id')
      .single();

    if (eventError) {
      console.error('Insert event error:', eventError);
      return NextResponse.json({ error: eventError.message }, { status: 500 });
    }

    // Thêm tags nếu có
    if (tags.length > 0) {
      // Giả sử tag là string name → cần tìm hoặc tạo Tag trước
      for (const tagName of tags) {
        const { data: existingTag } = await supabaseAdmin
          .from('Tag')
          .select('id')
          .eq('name', tagName.trim())
          .single();

        let tagId;
        if (existingTag) {
          tagId = existingTag.id;
        } else {
          const { data: newTag } = await supabaseAdmin
            .from('Tag')
            .insert({ name: tagName.trim() })
            .select('id')
            .single();
          tagId = newTag.id;
        }

        await supabaseAdmin
          .from('EventTag')
          .insert({ event_id: event.id, tag_id: tagId });
      }
    }

    return NextResponse.json({ success: true, message: 'Đăng sự kiện thành công!', eventId: event.id });
  } catch (err: any) {
    console.error('Post event error:', err);
    return NextResponse.json({ error: err.message || 'Lỗi server' }, { status: 500 });
  }
}