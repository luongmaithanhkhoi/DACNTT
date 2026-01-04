import EventDetailClient from "./EventDetailClient";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return <div className="container">Invalid event id</div>;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/events/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div className="container">Không tìm thấy sự kiện</div>;
  }

  const { item: ev } = await res.json();

  return <EventDetailClient ev={ev} />;
}
