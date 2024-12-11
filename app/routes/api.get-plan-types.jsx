import { json } from "@remix-run/node";
import prisma from "../db.server";

export const loader = async () => {
  try {
    // Fetch API keys from the database
    const settings = await prisma.apiSettings.findFirst();
    if (!settings || !settings.mayaApiKey || !settings.mayaSecretKey) {
      throw new Error("Maya API keys are missing in settings.");
    }

    const authString = `${settings.mayaApiKey}:${settings.mayaSecretKey}`;
    const encodedAuthString = Buffer.from(authString).toString("base64");

    // Fetch plan types from Maya API
    const response = await fetch(
      "https://api.maya.net/connectivity/v1/account/plan-types",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${encodedAuthString}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch plan types.");
    }

    return json({ planTypes: data.plan_types });
  } catch (error) {
    console.error("Error fetching plan types:", error.message);
    return json({ error: error.message }, { status: 500 });
  }
};
