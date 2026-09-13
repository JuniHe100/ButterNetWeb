export async function onRequestGet(context) {
    try {
        const db = context.env.DB;

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

    } catch (error) {
        return Response.json({
            ok:false,
            error:"Unable to load servers."
        }, {status:500});
    }
}
