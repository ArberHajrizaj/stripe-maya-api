import { json } from "@remix-run/node";
import prisma from "../db.server";
import QRCode from "qrcode";

export const action = async ({ request }) => {
  try {
    const { customer_id, plan_type_id } = await request.json();

    if (!plan_type_id) {
      throw new Error("Missing required field: plan_type_id.");
    }

    const settings = await prisma.apiSettings.findFirst();
    if (!settings || !settings.mayaApiKey || !settings.mayaSecretKey) {
      throw new Error("Maya API keys are missing in settings.");
    }

    const authString = `${settings.mayaApiKey}:${settings.mayaSecretKey}`;
    const encodedAuthString = Buffer.from(authString).toString("base64");

    const tag = `order-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    // Build request body
    const requestBody = {
      plan_type_id,
      tag,
    };

    if (customer_id) {
      requestBody.customer_id = customer_id;
    }

    const esimResponse = await fetch(
      "https://api.maya.net/connectivity/v1/esim",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedAuthString}`,
        },
        body: JSON.stringify(requestBody),
      },
    );

    const esimData = await esimResponse.json();


    if (!esimResponse.ok) {
      throw new Error(`Failed to create eSIM: ${esimData.message}`);
    }

    const { activation_code, uid } = esimData.esim;

    const qrCodeUrl = await QRCode.toDataURL(activation_code);

    return json({
      activation_code,
      uid, // This is your ICCID equivalent
      qrCodeUrl,
    });
  } catch (error) {
    console.error("❌ Error creating eSIM:", error.message);
    return json({ error: error.message }, { status: 500 });
  }
};
