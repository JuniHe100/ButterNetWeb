async function hashPassword(password, saltBytes) {
    const data = new TextEncoder().encode(password);
    const key = await crypto.subtle.importKey(
        "raw",
        data,
        "PBKDF2",
        false,
        ["deriveBits"]
    );

    const bits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: saltBytes,
            iterations: 100000,
            hash: "SHA-256"
        },
        key,
        256
    );

    return btoa(String.fromCharCode(...new Uint8Array(bits)));
}

function randomId(prefix) {
    return prefix + "_" + crypto.randomUUID().replaceAll("-", "");
}

export async function onRequestPost(context) {
    try {
        const db = context.env.DB;

        if (!db) {
            return Response.json(
                {ok:false,error:"ButterNet database is not connected."},
                {status:500}
            );
        }

        const body = await context.request.json();

        const username = String(body.username || "").trim();
        const password = String(body.password || "");

        if (!/^[A-Za-z0-9_]{3,24}$/.test(username)) {
            return Response.json(
                {ok:false,error:"Username must be 3-24 characters and use letters, numbers, or underscores."},
                {status:400}
            );
        }

        if (password.length < 6) {
            return Response.json(
                {ok:false,error:"Password must be at least 6 characters."},
                {status:400}
            );
        }

        const existing = await db
            .prepare("SELECT account_id FROM accounts WHERE username = ?")
            .bind(username)
            .first();

        if (existing) {
            return Response.json(
                {ok:false,error:"That username is already taken."},
                {status:409}
            );
        }

        const salt = crypto.getRandomValues(new Uint8Array(16));
        const saltText = btoa(String.fromCharCode(...salt));
        const hash = await hashPassword(password, salt);

        const accountId = randomId("acct");
        const now = new Date().toISOString();

        const passwordHash = "pbkdf2$100000$" + saltText + "$" + hash;

        await db.prepare(`
            INSERT INTO accounts
            (account_id,username,password_hash,tokens,
             welcome_tokens_granted,butternet_plus,
             is_owner,is_moderator,created_at)
            VALUES (?, ?, ?, 1000, 1, 1, 0, 0, ?)
        `)
        .bind(
            accountId,
            username,
            passwordHash,
            now
        )
        .run();

        await db.prepare(`
            INSERT INTO players
            (account_id,display_name,tokens,inventory_json,
             cosmetics_json,dorm_json,created_at,updated_at)
            VALUES (?, ?, 1000, '[]', '[]', '{}', ?, ?)
        `)
        .bind(accountId, username, now, now)
        .run();

        return Response.json({
            ok:true,
            account:{
                accountId,
                username,
                tokens:1000,
                butterNetPlus:true
            }
        }, {status:201});

    } catch (error) {
        return Response.json({
            ok:false,
            error:"Account creation failed.",
            detail:String(error)
        }, {status:500});
    }
}
