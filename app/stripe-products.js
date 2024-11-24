import prisma from "./db.server";

const settings = await prisma.apiSettings.findFirst();

const Stripe = require("stripe");
const stripe = new Stripe(settings.stripeSecretKey);

async function getAllProducts() {
  try {
    const products = await stripe.products.list();
    return products.data;
  } catch (error) {
    console.error("Error fetching products from Stripe:", error);
    throw error;
  }
}

module.exports = { getAllProducts };
