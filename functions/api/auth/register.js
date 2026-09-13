async function json(request) {
    try {
        return await request.json();
    } catch {
        return null;
    }
}

function response(data, status=200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        }
    });
}

export async function onRequestPost(context) {
    try {
        const body = await json(context.request);

        if (!body) {
            return response({
                ok: false,
                error: "Invalid JSON."
            }, 400);
        }

        const username = String(body.username || "").trim();
        const password = String(body.password || "");

        if (username.length < 3) {
            return response({
                ok: false,
                error: "Username must be at least 3 characters."
            }, 400);
        }

        if (username.length > 24) {
            return response({
                ok: false,
                error: "Username must be 24 characters or less."
            }, 400);
        }

        if (password.length < 6) {
            return response({
                ok: false,
                error: "Password must be at least 6 characters."
            }, 400);
        }

        const DB = context.env.DB;

        if (!DB) {
            return response({
                ok: false,
                error: "Database binding DB is not available."
            }, 500);
        }

        const existing = await DB
            .prepare("SELECT account_id FROM accounts WHERE username = ?")
            .bind(username)
            .first();

        if (existing) {
            return response({
                ok: false,
                error: "That username is already taken."
            }, 409);
        }

        const accountId =
            crypto.randomUUID();

        /*
         * Temporary password storage for the first ButterNet
         * development build.
         *
         * We will replace this with proper password hashing
         * before public production accounts are enabled.
         */

        await DB
            .prepare(`
                INSERT INTO accounts
                (
                    account_id,
                    username,
                    password_hash,
                    tokens,
                    welcome_tokens_granted,
                    butternet_plus,
                    is_owner,
                    is_moderator
                )
                VALUES (?, ?, ?, 1000, 1, 1, 0, 0)
            `)
            .bind(
                accountId,
                username,
                password
            )
            .run();

        return response({
            ok: true,
            account: {
                accountId,
                username,
                tokens: 1000,
                butterNetPlus: true
            }
        }, 201);

    } catch (error) {
        return response({
            ok: false,
            error: "Registration failed.",
            detail: String(error?.message || error)
        }, 500);
    }
}
