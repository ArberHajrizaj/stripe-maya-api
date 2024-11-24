import { json } from "@remix-run/node";
import prisma from "../db.server"; // Ensure this imports your Prisma client
import Stripe from "stripe";

export const loader = async () => {
  try {
    console.log("Fetching API settings for Stripe...");
    const settings = await prisma.apiSettings.findFirst();

    // Handle missing settings
    if (!settings || !settings.stripeSecretKey) {
      throw new Error("Stripe API key is missing in settings.");
    }

    console.log("Initializing Stripe with secret key...");
    const stripe = new Stripe(settings.stripeSecretKey);

    console.log("Fetching products from Stripe...");
    const products = await stripe.products.list();

    console.log("Fetched products:", products.data);
    return json(products.data); // Return the products to the frontend
  } catch (error) {
    console.error(
      "Error fetching products from Stripe:",
      error.message,
      error.stack,
    );
    return json({ error: error.message }, { status: 500 });
  }
};
