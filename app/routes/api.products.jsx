import { json } from "@remix-run/node";
import prisma from "../db.server";
import Stripe from "stripe";
import { corsHeaders, handlePreflight } from "../utils/cors";

export const loader = async ({ request }) => {
  // Inside loader:
  if (request.method === "OPTIONS") return handlePreflight();

  try {
    const settings = await prisma.apiSettings.findFirst();

    if (!settings || !settings.stripeSecretKey) {
      throw new Error("Stripe API key is missing in settings.");
    }

    const stripe = new Stripe(settings.stripeSecretKey);

    const products = await stripe.products.list();

    return json(products.data, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error(
      "Error fetching products from Stripe:",
      error.message,
      error.stack,
    );
    return json(
      { error: error.message },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
};
