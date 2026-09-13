export async function onRequestGet(context) {
    const db = context.env.DB;

    const result = await db.prepare(`
        SELECT
            club_id AS clubId,
            owner_id AS ownerId,
            name,
            description,
            icon,
            created_at AS createdAt
        FROM clubs
        ORDER BY name
    `).all();

    return Response.json({
        ok:true,
        clubs:result.results || []
    });
}
