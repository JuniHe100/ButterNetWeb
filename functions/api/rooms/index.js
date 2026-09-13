export async function onRequestGet(context) {

    return new Response(JSON.stringify({
        ok: true,
        rooms: [
            {
                roomId: "butternet-test-room",
                name: "ButterNet Test Room",
                serverId: "butternet-test-01",
                photonRoom: "ButterNetTest",
                region: "us",
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
