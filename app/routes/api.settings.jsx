import { json } from "@remix-run/node";
import prisma from "../db.server";

const defaultSettings = {
  stripePublishKey: "",
  stripeSecretKey: "",
  mayaApiKey: "",
  mayaSecretKey: "",
};

export const loader = async () => {
  try {
    console.log("Fetching API settings...");
    let settings = await prisma.apiSettings.findFirst();

    if (!settings) {
      console.warn("No API settings found. Creating default settings...");
      settings = await prisma.apiSettings.create({
        data: {
          stripePublishKey: "",
          stripeSecretKey: "",
          mayaApiKey: "",
          mayaSecretKey: "",
        },
      });
    }

    console.log("Fetched or created API settings:", settings);
    return json(settings);
  } catch (error) {
    console.error("Error loading API settings:", error.message);
    return json({ error: "Failed to load settings." }, { status: 500 });
  }
};

export const action = async ({ request }) => {
  try {
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, { status: 405 });
    }

    const data = await request.json();
    const { stripePublishKey, stripeSecretKey, mayaApiKey, mayaSecretKey } =
      data;

    // Validate incoming data
    if (
      !stripePublishKey ||
      !stripeSecretKey ||
      !mayaApiKey ||
      !mayaSecretKey
    ) {
      console.error("Missing required fields in request:", data);
      return json({ error: "All fields are required." }, { status: 400 });
    }

    // Save or update the settings in the database
    const updatedSettings = await prisma.apiSettings.upsert({
      where: { id: 1 }, // Assuming you're managing a single settings row
      update: { stripePublishKey, stripeSecretKey, mayaApiKey, mayaSecretKey },
      create: { stripePublishKey, stripeSecretKey, mayaApiKey, mayaSecretKey },
    });

    console.log("Settings updated successfully:", updatedSettings);
    return json(updatedSettings); // Send the updated settings back to the frontend
  } catch (error) {
    console.error("Error saving API settings:", error.message, error.stack);
    return json({ error: "Failed to save API settings." }, { status: 500 });
  }
};
