import { json } from "@remix-run/node";
import Stripe from "stripe";
import prisma from "../db.server";
import { corsHeaders, handlePreflight } from "../utils/cors";

export const loader = async ({ request }) => {
  if (request.method === "OPTIONS") return handlePreflight();

  return json(
    { error: "Method not allowed" },
    { status: 405, headers: corsHeaders },
  );
};

// Handle POST request to create Stripe checkout session
export const action = async ({ request }) => {
  try {
    const { priceId } = await request.json();
    if (!priceId) {
      throw new Error("Missing price ID");
    }

    const settings = await prisma.apiSettings.findFirst();
    if (!settings || !settings.stripeSecretKey) {
      throw new Error("Missing Stripe secret key in settings.");
    }

    const stripe = new Stripe(settings.stripeSecretKey);

    const host = request.headers.get("host");
    const protocol = host.includes("localhost") ? "http" : "https";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${protocol}://${host}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${protocol}://${host}/cancel`,
      expand: ["line_items.data.price.product"],
    });

    return json(
      { sessionId: session.id },
      {
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return json(
      { error: error.message },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
};
