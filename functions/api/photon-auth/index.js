export async function onRequestPost(context) {
    try {
        const db = context.env.DB;

        const body = await context.request.json();

        const username =
            String(body.username || "").trim();

        const account = await db.prepare(`
            SELECT
                account_id,
                username,
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
            return Response.json({
                ResultCode:2,
                Message:"ButterNet account not found."
            }, {status:401});
        }

        return Response.json({
            ResultCode:1,
            UserId:account.account_id,
            Nickname:account.username,
            Data:{
                product:"ButterNet",
                tokens:account.tokens,
                butterNetPlus:Boolean(account.butternet_plus),
                owner:Boolean(account.is_owner),
                moderator:Boolean(account.is_moderator)
            }
        });

    } catch (error) {
        return Response.json({
            ResultCode:3,
            Message:"ButterNet authentication service error."
        }, {status:500});
    }
}
