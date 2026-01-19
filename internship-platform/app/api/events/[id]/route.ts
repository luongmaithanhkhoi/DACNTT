import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const goodId = (id?: string) => {
  if (!id) return null;
  const t = id.trim();
  return t === "" || t === "undefined" || t === "null" ? null : t;
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id?: string }> }
) {
  try {
    const { id } = await params;         
    const safeId = goodId(id);

    if (!safeId) {
      return NextResponse.json(
        { error: "Invalid event id" },
        { status: 400 }
      );
    }

    const sb = createClient(SB_URL, SERVICE, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // lấy event + category
   const { data: ev, error: evErr } = await sb
  .from("Event")
  .select(`
    *,
    event_categories:category_id (
      id,
      name
    )
  `)
  .eq("id", id)
  .maybeSingle();


    if (evErr) {
      return NextResponse.json({ error: evErr.message }, { status: 400 });
    }
    if (!ev) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { data: et, error: etErr } = await sb
      .from("EventTag")
      .select("tag_id")
      .eq("event_id", id);

    if (etErr) {
      return NextResponse.json({ error: etErr.message }, { status: 400 });
    }

    const tagIds = (et ?? []).map((x: any) => x.tag_id);
    let tags: Array<{ id: string; name: string }> = [];

    if (tagIds.length) {
      const { data: tagRows, error: tagErr } = await sb
        .from("Tag")
        .select("id, name")
        .in("id", tagIds);

      if (tagErr) {
        return NextResponse.json({ error: tagErr.message }, { status: 400 });
      }

      tags = (tagRows ?? []) as Array<{ id: string; name: string }>;
    }

    return NextResponse.json({
      item: {
        ...ev,
        tags,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}

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

async function getUserRole(token: string): Promise<string | null> {
  const authClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return null;

  const { data: appUser } = await supabaseAdmin
    .from('User')
    .select('role')
    .eq('provider_uid', user.id)
    .single();

  return appUser?.role || null;
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id) return NextResponse.json({ error: 'Thiếu ID sự kiện' }, { status: 400 });

    const token = getBearerToken(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const role = await getUserRole(token);
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Chỉ admin mới được chỉnh sửa sự kiện' }, { status: 403 });
    }

    const body = await req.json();
    const { action, ...updateFields } = body;

    let updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Xử lý hành động đóng/mở
    if (action === 'close') {
      updateData.status = 'CLOSED';
      updateData.closed_at = new Date().toISOString();
    } else if (action === 'reopen') {
      updateData.status = 'APPROVED';
      updateData.closed_at = null;
    } else {
      // Cập nhật thông tin bình thường (edit event)
      updateData = {
        ...updateData,
        title: updateFields.title,
        description: updateFields.description,
        start_date: updateFields.start_date || null,
        end_date: updateFields.end_date || null,
        event_type: updateFields.event_type || 'OTHER',
        status: updateFields.status || 'PENDING',
        positions_available: updateFields.positions_available ? parseInt(updateFields.positions_available) : null,
        max_participants: updateFields.max_participants ? parseInt(updateFields.max_participants) : null,
        location: updateFields.location || null,
        required_skills: updateFields.required_skills || null,
      };
    }

    const { error: updateError } = await supabaseAdmin
      .from('Event')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      console.error('Update event error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Nếu có tags mới → xử lý như trước (xóa cũ → thêm mới)
    if (body.tags) {
      await supabaseAdmin.from('EventTag').delete().eq('event_id', id);

      for (const tagName of body.tags) {
        let tagId;
        const { data: existing } = await supabaseAdmin
          .from('Tag')
          .select('id')
          .eq('name', tagName.trim())
          .single();

        if (existing) {
          tagId = existing.id;
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
          .insert({ event_id: id, tag_id: tagId });
      }
    }

    return NextResponse.json({ success: true, message: 'Cập nhật sự kiện thành công!' });
  } catch (err: any) {
    console.error('Event update error:', err);
    return NextResponse.json({ error: err.message || 'Lỗi server' }, { status: 500 });
  }
}