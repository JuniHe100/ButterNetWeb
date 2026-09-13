export async function onRequestGet() {
  return new Response(JSON.stringify({
    ok: true,
    service: "ButterNet API",
    status: "online",
    version: "1.0.0"
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}
