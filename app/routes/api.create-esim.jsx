import { json } from "@remix-run/node";
import prisma from "../db.server";
import QRCode from "qrcode";

export const action = async ({ request }) => {
  try {
    const { customer_id, plan_type_id } = await request.json();

    if (!customer_id || !plan_type_id) {
      throw new Error("Missing required fields.");
    }

    // Fetch API keys from the database
    const settings = await prisma.apiSettings.findFirst();
    if (!settings || !settings.mayaApiKey || !settings.mayaSecretKey) {
      throw new Error("Maya API keys are missing in settings.");
    }

    const authString = `${settings.mayaApiKey}:${settings.mayaSecretKey}`;
    const encodedAuthString = Buffer.from(authString).toString("base64");

    // Create eSIM using Maya API
    const esimResponse = await fetch(
      "https://api.maya.net/connectivity/v1/esim",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedAuthString}`,
        },
        body: JSON.stringify({ customer_id, plan_type_id }),
      }
    );

    const esimData = await esimResponse.json();

    if (!esimResponse.ok) {
      throw new Error(`Failed to create eSIM: ${esimData.message}`);
    }

    const { activation_code, uid } = esimData.esim;

    // Generate a QR Code
    const qrCodeUrl = await QRCode.toDataURL(activation_code);

    return json({ activation_code, qrCodeUrl, uid });
  } catch (error) {
    console.error("Error creating eSIM:", error.message);
    return json({ error: error.message }, { status: 500 });
  }
};
