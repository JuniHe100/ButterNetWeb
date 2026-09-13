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

        const clubId =
            "club_" + crypto.randomUUID().replaceAll("-", "");

        const now = new Date().toISOString();

        await db.prepare(`
            INSERT INTO clubs
            (club_id,owner_id,name,description,icon,created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `)
        .bind(
            clubId,
            ownerId,
            name,
            String(body.description || ""),
            String(body.icon || ""),
            now
        )
        .run();

        await db.prepare(`
            INSERT INTO club_members
            (club_id,account_id,role,joined_at)
            VALUES (?, ?, 'owner', ?)
        `)
        .bind(clubId, ownerId, now)
        .run();

        return Response.json({
            ok:true,
            club:{
                clubId,
                name,
                role:"owner"
            }
        }, {status:201});

    } catch (error) {
        return Response.json({
            ok:false,
            error:"Club creation failed."
        }, {status:500});
    }
}
