import { json } from "@remix-run/node";
import Stripe from "stripe";
import prisma from "../db.server";

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
    const priceId = url.searchParams.get("priceId"); // Get priceId from the query parameter

    if (!priceId) {
      console.error("Missing priceId in query parameters.");
      return json({ error: "Missing priceId" }, { status: 400 });
    }

    console.log(`Fetching price details for priceId: ${priceId}`);
    const price = await stripe.prices.retrieve(priceId);
    return json(price);
  } catch (error) {
    console.error("Error fetching price details:", error.message);
    return json({ error: error.message }, { status: 500 });
  }
};
