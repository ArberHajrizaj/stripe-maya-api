import { json } from "@remix-run/node";
import prisma from "../db.server";
import { corsHeaders, handlePreflight } from "../utils/cors";

export const loader = async ({ request }) => {
  // Inside loader:
  if (request.method === "OPTIONS") return handlePreflight();

  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (!email) {
      throw new Error("User email is required.");
    }

    const settings = await prisma.apiSettings.findFirst();
    if (!settings || !settings.mayaApiKey || !settings.mayaSecretKey) {
      throw new Error("Maya API keys are missing in settings.");
    }

    const authString = `${settings.mayaApiKey}:${settings.mayaSecretKey}`;
    const encodedAuthString = Buffer.from(authString).toString("base64");

    // Fetch customer ID based on email
    const customerResponse = await fetch(
      `https://api.maya.net/connectivity/v1/customers?email=${email}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${encodedAuthString}`,
        },
      },
    );

    const customerData = await customerResponse.json();

    if (!customerResponse.ok || !customerData?.customers?.length) {
      throw new Error("Customer not found for the provided email.");
    }

    const customerId = customerData.customers[0].id;

    // Fetch eSIMs for the customer
    const esimResponse = await fetch(
      `https://api.maya.net/connectivity/v1/customer/${customerId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${encodedAuthString}`,
        },
      },
    );

    const esimData = await esimResponse.json();

    if (!esimResponse.ok) {
      throw new Error(`Failed to fetch eSIMs: ${esimData.message}`);
    }

    return json(
      { esims: esimData.customer.esims || [] },
      {
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error("Error fetching eSIMs:", error.message);
    return json(
      { error: error.message },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
};
