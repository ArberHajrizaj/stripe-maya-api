import { json } from "@remix-run/node";
import Stripe from "stripe";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  try {
    const settings = await prisma.apiSettings.findFirst();

    if (!settings || !settings.stripeSecretKey) {
      throw new Error("Stripe API key is missing in the database.");
    }

    const stripe = new Stripe(settings.stripeSecretKey);

    const url = new URL(request.url);
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId) {
      throw new Error("Missing session ID in the request.");
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"], // Ensure line items include product data
    });

    return json(session);
  } catch (error) {
    console.error("Error fetching Stripe session:", error.message);
    return json({ error: error.message }, { status: 500 });
  }
};
