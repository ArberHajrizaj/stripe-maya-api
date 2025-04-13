import { json } from "@remix-run/node";
import prisma from "../db.server"; // Ensure this imports your Prisma client

export const loader = async () => {
  try {
    // Fetch API keys from the database
    const settings = await prisma.apiSettings.findFirst();
    if (!settings || !settings.mayaApiKey || !settings.mayaSecretKey) {
      throw new Error("Maya API keys are missing in settings.");
    }

    const authString = `${settings.mayaApiKey}:${settings.mayaSecretKey}`;
    const encodedAuthString = Buffer.from(authString).toString("base64");

    // Call Maya API to retrieve the list of eSIMs
    const response = await fetch("https://api.maya.net/connectivity/v1/esim", {
      method: "GET",
      headers: {
        Authorization: `Basic ${encodedAuthString}`,
      },
    });

    // Parse the response
    const esimList = await response.json();
    if (!response.ok) {
      throw new Error(
        `Failed to fetch eSIMs: ${esimList.message || esimList.error}`,
      );
    }

    // Return the eSIM list to the frontend
    return json({ esimList });
  } catch (error) {
    console.error("Error fetching eSIMs:", error.message);
    return json({ error: error.message }, { status: 500 });
  }
};
