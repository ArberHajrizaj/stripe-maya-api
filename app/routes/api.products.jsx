import { json } from "@remix-run/node";
import prisma from "../db.server";
import Stripe from "stripe";

// Helper to attach CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const loader = async () => {
  try {
    console.log("Fetching API settings for Stripe...");
    const settings = await prisma.apiSettings.findFirst();

    if (!settings || !settings.stripeSecretKey) {
      throw new Error("Stripe API key is missing in settings.");
    }

    console.log("Initializing Stripe with secret key...");
    const stripe = new Stripe(settings.stripeSecretKey);

    console.log("Fetching products from Stripe...");
    const products = await stripe.products.list();

    console.log("Fetched products:", products.data);
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
      }
    );
  }
};
