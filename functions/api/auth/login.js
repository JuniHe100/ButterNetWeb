async function verifyPassword(password, stored) {
    const parts = String(stored || "").split("$");

    if (parts.length !== 4 || parts[0] !== "pbkdf2") {
        return false;
    }

    const iterations = Number(parts[1]);
    const salt = Uint8Array.from(
        atob(parts[2]),
        c => c.charCodeAt(0)
    );

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
            name:"PBKDF2",
            salt,
            iterations,
            hash:"SHA-256"
        },
        key,
        256
    );

    const calculated = btoa(
        String.fromCharCode(...new Uint8Array(bits))
    );

    return calculated === parts[3];
}

export async function onRequestPost(context) {
    try {
        const db = context.env.DB;
        const body = await context.request.json();

        const username = String(body.username || "").trim();
        const password = String(body.password || "");

        const account = await db.prepare(`
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

        if (!account || !(await verifyPassword(password, account.password_hash))) {
            return Response.json(
                {ok:false,error:"Invalid username or password."},
                {status:401}
            );
        }

        const sessionId = crypto.randomUUID();
        const now = new Date();
        const expires = new Date(
            now.getTime() + 30 * 24 * 60 * 60 * 1000
        );

        await db.prepare(`
            INSERT INTO sessions
            (session_id,account_id,created_at,expires_at)
            VALUES (?, ?, ?, ?)
        `)
        .bind(
            sessionId,
            account.account_id,
            now.toISOString(),
            expires.toISOString()
        )
        .run();

        return Response.json({
            ok:true,
            sessionId,
            account:{
                accountId:account.account_id,
                username:account.username,
                tokens:account.tokens,
                butterNetPlus:Boolean(account.butternet_plus),
                owner:Boolean(account.is_owner),
                moderator:Boolean(account.is_moderator)
            }
        });

    } catch (error) {
        return Response.json({
            ok:false,
            error:"Login failed."
        }, {status:500});
    }
}
