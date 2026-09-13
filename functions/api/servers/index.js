export async function onRequestGet(context) {

    return new Response(JSON.stringify({
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
    }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        }
    });
}
