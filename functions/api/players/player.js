export async function onRequestGet(context) {
    try {
        const db = context.env.DB;
        const url = new URL(context.request.url);
        const accountId = url.searchParams.get("accountId");

        if (!accountId) {
            return Response.json(
                {ok:false,error:"accountId is required."},
                {status:400}
            );
        }

        const player = await db.prepare(`
            SELECT
                account_id AS accountId,
                display_name AS displayName,
                tokens,
                inventory_json AS inventory,
                cosmetics_json AS cosmetics,
                dorm_json AS dorm,
                updated_at AS updatedAt
            FROM players
            WHERE account_id = ?
        `)
        .bind(accountId)
        .first();

        if (!player) {
            return Response.json(
                {ok:false,error:"Player not found."},
                {status:404}
            );
        }

        return Response.json({
            ok:true,
            player:{
                ...player,
                inventory:JSON.parse(player.inventory || "[]"),
                cosmetics:JSON.parse(player.cosmetics || "[]"),
                dorm:JSON.parse(player.dorm || "{}")
            }
        });

    } catch (error) {
        return Response.json({
            ok:false,
            error:"Unable to load player."
        }, {status:500});
    }
}
