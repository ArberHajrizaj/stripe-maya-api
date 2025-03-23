import { json } from "@remix-run/node";
import Stripe from "stripe";
import prisma from "../db.server";

// Reusable CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const loader = async ({ request }) => {
  try {
    console.log("Fetching API settings from database...");
    const settings = await prisma.apiSettings.findFirst();
    if (!settings || !settings.stripeSecretKey) {
      console.error("API settings are missing or invalid.");
      throw new Error("Stripe API key is missing in settings.");
    }
    console.log("API settings fetched successfully.");

    const stripe = new Stripe(settings.stripeSecretKey);

    const url = new URL(request.url);
    const priceId = url.searchParams.get("priceId");

    if (!priceId) {
      console.error("Missing priceId in query parameters.");
      return json(
        { error: "Missing priceId" },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log(`Fetching price details for priceId: ${priceId}`);
    const price = await stripe.prices.retrieve(priceId);

    return json(price, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching price details:", error.message);
    return json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
};
