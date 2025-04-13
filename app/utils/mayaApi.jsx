// utils/mayaApi.jsx
import prisma from "../db.server";

export const createMayaCustomer = async (
  email,
  first_name,
  last_name,
  iccid = null,
) => {
  const settings = await prisma.apiSettings.findFirst();
  if (!settings?.mayaApiKey || !settings?.mayaSecretKey) {
    throw new Error("Maya API keys are missing in settings");
  }

  const authString = `${settings.mayaApiKey}:${settings.mayaSecretKey}`;
  const encodedAuthString = Buffer.from(authString).toString("base64");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${encodedAuthString}`,
  };

  const postResponse = await fetch(
    "https://api.maya.net/connectivity/v1/customer",
    {
      method: "POST",
      headers,
      body: JSON.stringify({ email, first_name, last_name }),
    },
  );

  if (postResponse.status === 400) {
    const text = await postResponse.text();
    const match = text.match(/ID:\s?([a-zA-Z0-9]+)/);

    if (match && match[1]) {
      const customerId = match[1];
      const getCustomerResponse = await fetch(
        `https://api.maya.net/connectivity/v1/customer/${customerId}`,
        { method: "GET", headers },
      );
      const customerData = await getCustomerResponse.json();

      if (getCustomerResponse.ok && customerData.customer) {
        return customerData.customer;
      }
    }

    // Fallback via ICCID
    if (iccid) {
      const esimResponse = await fetch(
        `https://api.maya.net/connectivity/v1/esim/${iccid}`,
        { method: "GET", headers },
      );
      const esimData = await esimResponse.json();
      const fallbackCustomerId = esimData?.esim?.customer_id;

      if (esimResponse.ok && fallbackCustomerId) {
        const customerResponse = await fetch(
          `https://api.maya.net/connectivity/v1/customer/${fallbackCustomerId}`,
          { method: "GET", headers },
        );
        const customerData = await customerResponse.json();

        if (customerResponse.ok && customerData.customer) {
          return customerData.customer;
        }
      }
    }

    throw new Error(
      "Customer creation failed, and fallback via ICCID also failed.",
    );
  }

  if (!postResponse.ok) {
    const errorText = await postResponse.text();
    throw new Error(`Failed to create Maya customer: ${errorText}`);
  }

  const result = await postResponse.json();
  return result.customer;
};
