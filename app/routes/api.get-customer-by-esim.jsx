import { json } from "@remix-run/node";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const iccid = url.searchParams.get("iccid");

  if (!iccid) {
    return json({ error: "Missing ICCID" }, { status: 400 });
  }

  const settings = await prisma.apiSettings.findFirst();
  if (!settings?.mayaApiKey || !settings?.mayaSecretKey) {
    return json({ error: "Maya API keys missing" }, { status: 500 });
  }

  const encoded = Buffer.from(
    `${settings.mayaApiKey}:${settings.mayaSecretKey}`,
  ).toString("base64");

  const res = await fetch(
    `https://api.maya.net/connectivity/v1/esim/${iccid}`,
    {
      headers: {
        Authorization: `Basic ${encoded}`,
        "Content-Type": "application/json",
      },
    },
  );


  const data = await res.json();
  if (!res.ok || !data?.esim?.customer_id) {
    return json({ error: "Customer not found via ICCID." }, { status: 404 });
  }

  return json({ customer: { id: data.esim.customer_id } });
};
