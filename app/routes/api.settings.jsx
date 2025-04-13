import { json } from "@remix-run/node";
import prisma from "../db.server";
import { isAuthorized } from "../utils/auth";
import { corsHeaders, handlePreflight } from "../utils/cors";

const defaultSettings = {
  stripePublishKey: "",
  stripeSecretKey: "",
  mayaApiKey: "",
  mayaSecretKey: "",
};



// --- GET SETTINGS ---
export const loader = async ({ request }) => {
  if (request.method === "OPTIONS") return handlePreflight();

  if (!isAuthorized(request)) {
    return json(
      { error: "Unauthorized" },
      { status: 401, headers: corsHeaders },
    );
  }

  try {
    let settings = await prisma.apiSettings.findFirst();
    if (!settings) {
      settings = await prisma.apiSettings.create({ data: defaultSettings });
    }

    return json(settings, { headers: corsHeaders });
  } catch (error) {
    return json(
      { error: "Failed to load settings." },
      { status: 500, headers: corsHeaders },
    );
  }
};

// --- POST SETTINGS ---
export const action = async ({ request }) => {
  if (request.method === "OPTIONS") return handlePreflight();

  if (!isAuthorized(request)) {
    return json(
      { error: "Unauthorized" },
      { status: 401, headers: corsHeaders },
    );
  }

  if (request.method !== "POST") {
    return json(
      { error: "Method not allowed" },
      { status: 405, headers: corsHeaders },
    );
  }

  try {
    const data = await request.json();
    const { stripePublishKey, stripeSecretKey, mayaApiKey, mayaSecretKey } =
      data;

    if (
      !stripePublishKey ||
      !stripeSecretKey ||
      !mayaApiKey ||
      !mayaSecretKey
    ) {
      return json(
        { error: "All fields are required." },
        { status: 400, headers: corsHeaders },
      );
    }

    const updatedSettings = await prisma.apiSettings.upsert({
      where: { id: 1 },
      update: { stripePublishKey, stripeSecretKey, mayaApiKey, mayaSecretKey },
      create: { stripePublishKey, stripeSecretKey, mayaApiKey, mayaSecretKey },
    });

    return json(updatedSettings, { headers: corsHeaders });
  } catch (error) {
    return json(
      { error: "Failed to save API settings." },
      { status: 500, headers: corsHeaders },
    );
  }
};
