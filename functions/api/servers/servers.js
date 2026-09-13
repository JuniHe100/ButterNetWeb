export async function onRequestGet(context) {
  const db = context.env.BUTTERNET_DB;

  if (!db) {
    return Response.json({
      ok: false,
      error: "DATABASE_NOT_CONFIGURED"
    }, { status: 503 });
  }

  const result = await db.prepare(
    "SELECT * FROM servers WHERE online = 1 ORDER BY name ASC"
  ).all();

  return Response.json({
    ok: true,
    servers: result.results || []
  });
}
