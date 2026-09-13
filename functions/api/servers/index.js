export async function onRequestGet(context) {
  try {
    const db = context.env.DB;

    if (!db) {
      return Response.json(
        { ok:false, error:"D1 binding DB is missing" },
        { status:500 }
      );
    }

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS servers (
        server_id TEXT PRIMARY KEY,
        name TEXT,
        region TEXT,
        room TEXT,
        online INTEGER DEFAULT 0,
        players INTEGER DEFAULT 0,
        max_players INTEGER DEFAULT 20,
        last_heartbeat TEXT
      )
    `).run();

    const result = await db.prepare(`
      SELECT
        server_id AS id,
        name,
        region,
        room,
        online,
        players,
        max_players AS maxPlayers,
        last_heartbeat AS lastHeartbeat
      FROM servers
      WHERE online = 1
      ORDER BY name
    `).all();

    return Response.json({
      ok:true,
      service:"ButterNet Server Registry",
      servers:result.results || []
    });
  } catch (e) {
    return Response.json({
      ok:false,
      error:String(e),
      servers:[]
    }, { status:500 });
  }
}
