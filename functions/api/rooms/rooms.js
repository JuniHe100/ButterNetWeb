export async function onRequestGet(context) {
  const db = context.env.BUTTERNET_DB;

  if (!db) {
    return Response.json({
      ok: false,
      error: "DATABASE_NOT_CONFIGURED"
    }, { status: 503 });
  }

  const result = await db.prepare(
    "SELECT * FROM rooms WHERE published = 1 ORDER BY created_at DESC"
  ).all();

  return Response.json({
    ok: true,
    rooms: result.results || []
  });
}
