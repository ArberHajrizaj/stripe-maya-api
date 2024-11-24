import prisma from "../db.server";

export const createMayaCustomer = async (email, first_name, last_name) => {
  try {
    console.log("Sending request to Maya API for customer creation...");

    // Fetch API keys from the database
    const settings = await prisma.apiSettings.findFirst();
    if (!settings || !settings.mayaApiKey || !settings.mayaSecretKey) {
      throw new Error("Maya API keys are missing in settings");
    }

    const authString = `${settings.mayaApiKey}:${settings.mayaSecretKey}`;
    const encodedAuthString = Buffer.from(authString).toString("base64");

    // Check if the customer already exists (add this pre-check)
    const existingResponse = await fetch(
      `https://api.maya.net/connectivity/v1/customer/search?email=${email}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${encodedAuthString}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (existingResponse.ok) {
      const existingCustomer = await existingResponse.json();
      if (existingCustomer.customer) {
        console.log("Customer already exists:", existingCustomer.customer);
        return existingCustomer.customer;
      }
    }

    // Create a new customer if no existing customer was found
    const response = await fetch(
      "https://api.maya.net/connectivity/v1/customer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedAuthString}`,
        },
        body: JSON.stringify({
          email,
          first_name,
          last_name,
        }),
      },
    );

    const result = await response.json();
    console.log("Maya API Response:", result);

    if (!response.ok) {
      throw new Error(
        `Failed to create customer: ${result.message || response.statusText}`,
      );
    }

    return result.customer; // Return the newly created customer
  } catch (error) {
    console.error("Error creating customer at Maya:", error);
    throw error;
  }
};
