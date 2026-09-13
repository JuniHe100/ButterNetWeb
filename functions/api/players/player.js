export async function onRequestGet(context) {
  const db = context.env.BUTTERNET_DB;

  if (!db) {
    return Response.json({
      ok: false,
      error: "DATABASE_NOT_CONFIGURED"
    }, { status: 503 });
  }

  return Response.json({
    ok: true,
    message: "Player API is online."
  });
}
