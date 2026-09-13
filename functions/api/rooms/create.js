export async function onRequestPost(context) {
    try {
        const db = context.env.DB;
        const body = await context.request.json();

        const ownerId = String(body.ownerId || "");
        const name = String(body.name || "").trim();

        if (!ownerId || !name) {
            return Response.json(
                {ok:false,error:"ownerId and name are required."},
                {status:400}
            );
        }

        const roomId = "room_" + crypto.randomUUID().replaceAll("-", "");
        const photonRoom =
            "BN_" + roomId.replace("room_", "");

        const now = new Date().toISOString();

        await db.prepare(`
            INSERT INTO rooms
            (room_id,owner_id,name,description,
             server_id,photon_room,region,
             max_players,players,published,public,
             created_at,updated_at)
            VALUES (?, ?, ?, ?, NULL, ?, ?, ?, 0, 0, 1, ?, ?)
        `)
        .bind(
            roomId,
            ownerId,
            name,
            String(body.description || ""),
            photonRoom,
            String(body.region || "us"),
            Math.min(Math.max(Number(body.maxPlayers || 20),1),100),
            now,
            now
        )
        .run();

        return Response.json({
            ok:true,
            room:{
                roomId,
                name,
                photonRoom,
                published:false
            }
        }, {status:201});

    } catch (error) {
        return Response.json({
            ok:false,
            error:"Room creation failed.",
            detail:String(error)
        }, {status:500});
    }
}
