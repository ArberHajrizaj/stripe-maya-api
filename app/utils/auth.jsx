export function isAuthorized(request) {
  const authHeader = request.headers.get("authorization");
  const token = process.env.SETTINGS_API_TOKEN;

  console.log("Header:", authHeader);
  console.log("Token:", token);

  return authHeader === `Bearer ${token}`;
}
