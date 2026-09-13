const response = (data, status=200) =>
    new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        }
    });

export async function onRequestPost(context) {

    try {

        const body = await context.request.json();

        const username = String(body.username || "").trim();
        const password = String(body.password || "");

        if (!username || !password) {
            return response({
                ok: false,
                error: "Username and password are required."
            }, 400);
        }

        const DB = context.env.DB;

        if (!DB) {
            return response({
                ok: false,
                error: "Database binding DB is not available."
            }, 500);
        }

        const account = await DB
            .prepare(`
                SELECT
                    account_id,
                    username,
                    password_hash,
                    tokens,
                    butternet_plus,
                    is_owner,
                    is_moderator
                FROM accounts
                WHERE username = ?
            `)
            .bind(username)
            .first();

        if (!account) {
            return response({
                ok: false,
                error: "Invalid username or password."
            }, 401);
        }

        if (account.password_hash !== password) {
            return response({
                ok: false,
                error: "Invalid username or password."
            }, 401);
        }

        return response({
            ok: true,
            account: {
                accountId: account.account_id,
                username: account.username,
                tokens: account.tokens,
                butterNetPlus: !!account.butternet_plus,
                owner: !!account.is_owner,
                moderator: !!account.is_moderator
            }
        });

    } catch (error) {

        return response({
            ok: false,
            error: "Login failed.",
            detail: String(error?.message || error)
        }, 500);
    }
}
