export async function onRequestGet(context) {

    const url = new URL(context.request.url);

    const user =
        url.searchParams.get("user") ||
        url.searchParams.get("userid") ||
        url.searchParams.get("userId") ||
        "ButterNetGuest";

    const build =
        url.searchParams.get("build") ||
        url.searchParams.get("version") ||
        "unknown";

    return new Response(JSON.stringify({
        ResultCode: 1,
        UserId: user,
        Nickname: user,
        Data: {
            service: "ButterNet",
            build: build,
            butterNetPlus: true
        }
    }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        }
    });
}
