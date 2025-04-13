export function isAuthorized(request) {
  const authHeader = request.headers.get("authorization");
  const token = process.env.SETTINGS_API_TOKEN;

  return authHeader === `Bearer ${token}`;
}
