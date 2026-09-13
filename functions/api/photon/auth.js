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

    const url = new URL(context.request.url);

    const user =
        url.searchParams.get("user") ||
        url.searchParams.get("userid") ||
        url.searchParams.get("userId") ||
        "ButterNetGuest";

    const build =
        url.searchParams.get("build") ||
        url.searchParams.get("version") ||
        "ButterNet-16658380";

    return response({
        ResultCode: 1,
        UserId: user,
        Nickname: user,
        Data: {
            service: "ButterNet",
            build,
            butterNetPlus: true
        }
    });
}
