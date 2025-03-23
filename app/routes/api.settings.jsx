import { json } from "@remix-run/node";
import prisma from "../db.server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const defaultSettings = {
  stripePublishKey: "",
  stripeSecretKey: "",
  mayaApiKey: "",
  mayaSecretKey: "",
};

// Handle GET requests
export const loader = async () => {
  try {
    console.log("Fetching API settings...");
    let settings = await prisma.apiSettings.findFirst();

    if (!settings) {
      console.warn("No API settings found. Creating default settings...");
      settings = await prisma.apiSettings.create({
        data: defaultSettings,
      });
    }

    console.log("Fetched or created API settings:", settings);
    return json(settings, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("Error loading API settings:", error.message);
    return json(
      { error: "Failed to load settings." },
      { status: 500, headers: CORS_HEADERS }
    );
  }
};

// Handle POST and OPTIONS (preflight)
export const action = async ({ request }) => {
  try {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, { status: 405, headers: CORS_HEADERS });
    }

    const data = await request.json();
    const { stripePublishKey, stripeSecretKey, mayaApiKey, mayaSecretKey } = data;

    if (!stripePublishKey || !stripeSecretKey || !mayaApiKey || !mayaSecretKey) {
      console.error("Missing required fields in request:", data);
      return json({ error: "All fields are required." }, { status: 400, headers: CORS_HEADERS });
    }

    const updatedSettings = await prisma.apiSettings.upsert({
      where: { id: 1 },
      update: { stripePublishKey, stripeSecretKey, mayaApiKey, mayaSecretKey },
      create: { stripePublishKey, stripeSecretKey, mayaApiKey, mayaSecretKey },
    });

    console.log("Settings updated successfully:", updatedSettings);
    return json(updatedSettings, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("Error saving API settings:", error.message, error.stack);
    return json({ error: "Failed to save API settings." }, { status: 500, headers: CORS_HEADERS });
  }
};
