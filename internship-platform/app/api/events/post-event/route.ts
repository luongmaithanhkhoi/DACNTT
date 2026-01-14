import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SVC = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SVC);

function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(' ');
  return scheme?.toLowerCase() === 'bearer' ? token : null;
}

async function getUserRoleAndId(token: string): Promise<{ role: string | null; userId: string | null }> {
  const authClient = createClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return { role: null, userId: null };

  const { data: appUser } = await supabaseAdmin
    .from('User')
    .select('id, role')
    .eq('provider_uid', user.id)
    .single();

  return { role: appUser?.role || null, userId: appUser?.id || null };
}

export async function POST(req: Request) {
  try {
    const token = getBearerToken(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { role, userId } = await getUserRoleAndId(token);
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Chỉ admin mới được đăng sự kiện' }, { status: 403 });
    }

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

    const { data: event, error: eventError } = await supabaseAdmin
      .from('Event')
      .insert({
        creator_id: userId,  // Sử dụng userId của admin
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