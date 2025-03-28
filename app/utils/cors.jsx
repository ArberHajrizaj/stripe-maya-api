// utils/cors.js
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const handlePreflight = () =>
  new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
