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
        service: "ButterNet Rooms",
        rooms: [
            {
                roomId: "butternet-test-room",
                name: "ButterNet Test Room",
                serverId: "butternet-test-01",
                photonRoom: "ButterNetTest",
                region: "us",
                online: true,
                players: 0,
                maxPlayers: 20,
                published: true
            }
        ]
    });
}
