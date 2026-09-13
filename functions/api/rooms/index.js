export async function onRequestGet(context) {
    try {
        const db = context.env.DB;

        const result = await db.prepare(`
            SELECT
                room_id AS roomId,
                owner_id AS ownerId,
                name,
                description,
                server_id AS serverId,
                photon_room AS photonRoom,
                region,
                max_players AS maxPlayers,
                players,
                published,
                public
            FROM rooms
            WHERE published = 1
              AND public = 1
            ORDER BY name
        `).all();

        return Response.json({
            ok:true,
            rooms:result.results || []
        });

    } catch (error) {
        return Response.json({
            ok:false,
            error:"Unable to load rooms.",
            detail:String(error)
        }, {status:500});
    }
}
