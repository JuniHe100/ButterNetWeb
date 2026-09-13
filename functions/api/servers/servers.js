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
    return response({
        ok: true,
        service: "ButterNet Server Registry",
        servers: [
            {
                id: "butternet-test-01",
                name: "ButterNet Test Server",
                region: "us",
                room: "ButterNetTest",
                online: true,
                players: 0,
                maxPlayers: 20
            }
        ]
    });
}
