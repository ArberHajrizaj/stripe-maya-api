import { json } from "@remix-run/node";
import Stripe from "stripe";
import prisma from "../db.server";

const settings = await prisma.apiSettings.findFirst();
const stripe = new Stripe(settings.stripeSecretKey);

export const action = async ({ request }) => {
  try {
    const { priceId } = await request.json();
    if (!priceId) {
      throw new Error("Missing price ID");
    }

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
      expand: ["line_items.data.price.product"], // Ensure line items include product metadata
    });

    return json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return json({ error: error.message }, { status: 500 });
  }
};
