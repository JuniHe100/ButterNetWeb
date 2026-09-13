export async function onRequest(context) {
  return Response.json({
    ResultCode: 2,
    Message: "ButterNet Photon authentication is not configured yet."
  });
}
