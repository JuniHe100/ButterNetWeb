export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const username = String(body.username || "").trim();
    const password = String(body.password || "");

    if (!username || !password) {
      return Response.json({
        ok: false,
        error: "USERNAME_AND_PASSWORD_REQUIRED"
      }, { status: 400 });
    }

    if (username.length < 3 || username.length > 20) {
      return Response.json({
        ok: false,
        error: "INVALID_USERNAME"
      }, { status: 400 });
    }

    if (password.length < 8) {
      return Response.json({
        ok: false,
        error: "PASSWORD_TOO_SHORT"
      }, { status: 400 });
    }

    const db = context.env.BUTTERNET_DB;

    if (!db) {
      return Response.json({
        ok: false,
        error: "DATABASE_NOT_CONFIGURED"
      }, { status: 503 });
    }

    const existing = await db.prepare(
      "SELECT account_id FROM accounts WHERE username = ?"
    ).bind(username).first();

    if (existing) {
      return Response.json({
        ok: false,
        error: "USERNAME_TAKEN"
      }, { status: 409 });
    }

    const accountId = crypto.randomUUID();

    /*
      Password hashing will be added before production authentication.
      Do NOT store plaintext passwords.
    */

    return Response.json({
      ok: true,
      accountId,
      username,
      message: "Account ID generated. Authentication storage will be enabled next."
    });

  } catch {
    return Response.json({
      ok: false,
      error: "INVALID_REQUEST"
    }, { status: 400 });
  }
}
