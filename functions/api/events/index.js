export async function onRequestGet(context) {
    try {
        const db = context.env.DB;

        const result = await db.prepare(`
            SELECT
                event_id AS eventId,
                owner_id AS ownerId,
                name,
                description,
                room_id AS roomId,
                start_time AS startTime,
                end_time AS endTime,
                max_players AS maxPlayers
            FROM events
            ORDER BY start_time
        `).all();

        return Response.json({
            ok:true,
            events:result.results || []
        });

    } catch (error) {
        return Response.json({
            ok:false,
            error:"Unable to load events."
        }, {status:500});
    }
}
