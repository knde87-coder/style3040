export default function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ ok: false });
    return;
  }

  const { adminId, password } = request.body || {};
  const expectedId = process.env.GOODFORM_ADMIN_ID;
  const expectedPassword = process.env.GOODFORM_ADMIN_PASSWORD;

  if (!expectedId || !expectedPassword) {
    response.status(500).json({ ok: false, message: "ADMIN_ENV_MISSING" });
    return;
  }

  if (adminId === expectedId && password === expectedPassword) {
    response.status(200).json({ ok: true });
    return;
  }

  response.status(401).json({ ok: false });
}
