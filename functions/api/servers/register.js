export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

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

    const now = new Date().toISOString();

    await db.prepare(`
      INSERT INTO servers
      (server_id,name,region,room,online,players,max_players,last_heartbeat)
      VALUES (?,?,?,?,?,?,?,?)
      ON CONFLICT(server_id) DO UPDATE SET
        name=excluded.name,
        region=excluded.region,
        room=excluded.room,
        online=excluded.online,
        players=excluded.players,
        max_players=excluded.max_players,
        last_heartbeat=excluded.last_heartbeat
    `).bind(
      body.serverId,
      body.name || "ButterNet Server",
      body.region || "us",
      body.room || "",
      body.online ? 1 : 0,
      Number(body.players || 0),
      Number(body.maxPlayers || 20),
      now
    ).run();

    return Response.json({
      ok:true,
      serverId:body.serverId,
      registered:true,
      heartbeat:now
    });
  } catch (e) {
    return Response.json({
      ok:false,
      error:String(e)
    }, { status:500 });
  }
}

export async function onRequestGet() {
  return Response.json({
    ok:true,
    service:"ButterNet server registration",
    method:"POST"
  });
}
