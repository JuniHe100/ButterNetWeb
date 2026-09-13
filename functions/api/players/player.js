function response(data, status=200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        }
    });
}

export async function onRequestGet(context) {
    const DB = context.env.DB;

    if (!DB) {
        return response({
            ok: false,
            error: "Database binding DB is not available."
        }, 500);
    }

    const url = new URL(context.request.url);
    const username = url.searchParams.get("username");

    if (!username) {
        return response({
            ok: false,
            error: "username is required."
        }, 400);
    }

    const player = await DB
        .prepare(`
            SELECT
                account_id,
                username,
                tokens,
                butternet_plus,
                is_owner,
                is_moderator,
                created_at
            FROM accounts
            WHERE username = ?
        `)
        .bind(username)
        .first();

    if (!player) {
        return response({
            ok: false,
            error: "Player not found."
        }, 404);
    }

    return response({
        ok: true,
        player
    });
}
