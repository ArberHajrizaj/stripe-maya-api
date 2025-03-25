import { json } from "@remix-run/node";
import Stripe from "stripe";
import prisma from "../db.server";
import { corsHeaders, handlePreflight } from "../utils/cors";

export const loader = async ({ request }) => {
  // Inside loader:
  if (request.method === "OPTIONS") return handlePreflight();

  try {
    const settings = await prisma.apiSettings.findFirst();
    if (!settings || !settings.stripeSecretKey) {
      console.error("API settings are missing or invalid.");
      throw new Error("Stripe API key is missing in settings.");
    }

    const stripe = new Stripe(settings.stripeSecretKey);

    const url = new URL(request.url);
    const priceId = url.searchParams.get("priceId");

    if (!priceId) {
      console.error("Missing priceId in query parameters.");
      return json(
        { error: "Missing priceId" },
        { status: 400, headers: corsHeaders },
      );
    }
    const price = await stripe.prices.retrieve(priceId);

    return json(price, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching price details:", error.message);
    return json(
      { error: error.message },
      { status: 500, headers: corsHeaders },
    );
  }
};
