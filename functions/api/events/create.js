export async function onRequestPost(context) {
    try {
        const db = context.env.DB;
        const body = await context.request.json();

        const ownerId = String(body.ownerId || "");
        const name = String(body.name || "").trim();
        const startTime = String(body.startTime || "");

        if (!ownerId || !name || !startTime) {
            return Response.json(
                {ok:false,error:"ownerId, name, and startTime are required."},
                {status:400}
            );
        }

        const eventId =
            "event_" + crypto.randomUUID().replaceAll("-", "");

        const now = new Date().toISOString();

        await db.prepare(`
            INSERT INTO events
            (event_id,owner_id,name,description,
             room_id,start_time,end_time,max_players,created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
            eventId,
            ownerId,
            name,
            String(body.description || ""),
            body.roomId ? String(body.roomId) : null,
            startTime,
            body.endTime ? String(body.endTime) : null,
            Math.min(Math.max(Number(body.maxPlayers || 20),1),100),
            now
        )
        .run();

        return Response.json({
            ok:true,
            event:{
                eventId,
                name,
                startTime
            }
        }, {status:201});

    } catch (error) {
        return Response.json({
            ok:false,
            error:"Event creation failed."
        }, {status:500});
    }
}
