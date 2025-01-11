import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./styles/messages.css";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const createCustomerAndEsim = async (sessionId) => {
    try {
      if (!sessionId) {
        throw new Error("No sessionId found in URL.");
      }

      const stripeResponse = await fetch(
        `/api/get-stripe-session?session_id=${sessionId}`,
      );
      const stripeData = await stripeResponse.json();

      if (!stripeResponse.ok) {
        throw new Error(`Failed to fetch Stripe session: ${stripeData.error}`);
      }

      const { email, name } = stripeData.customer_details || {};
      const lineItems = stripeData.line_items?.data || [];

      console.log("Email from Stripe session:", email);

      if (!email || !name || lineItems.length === 0) {
        throw new Error(
          "Stripe session data is incomplete. Missing email, name, or line items.",
        );
      }

      const [firstName, ...lastNameArr] = name.split(" ");
      const lastName = lastNameArr.join(" ");

      const mayaResponse = await fetch("/api/create-maya-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      const mayaData = await mayaResponse.json();

      if (!mayaResponse.ok) {
        throw new Error(`Failed to create Maya customer: ${mayaData.error}`);
      }

      const mayaCustomerId = mayaData.mayaCustomer.id;

      for (const item of lineItems) {
        const product = item.price.product; // Product data is expanded
        const planTypeId = product.metadata?.PlanID;

        if (!planTypeId) {
          throw new Error(`PlanID is missing in the product metadata.`);
        }

        const esimResponse = await fetch("/api/create-esim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: mayaCustomerId,
            plan_type_id: planTypeId,
          }),
        });

        const esimData = await esimResponse.json();
        if (!esimResponse.ok) {
          throw new Error(`Failed to create eSIM: ${esimData.error}`);
        }

        console.log("Sending email with details:", {
          email,
          qrCodeUrl: esimData.qrCodeUrl,
          activationCode: esimData.activation_code,
        });

        // Send email with QR code and activation code
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email, // Retrieved from Stripe
            qrCodeUrl: esimData.qrCodeUrl, // Generated QR code URL
            activationCode: esimData.activation_code, // Activation code from eSIM API
          }),
        });

        console.log("eSIM created successfully and email sent:", esimData);
      }
    } catch (error) {
      console.error(
        "Error during customer and eSIM creation process:",
        error.message,
      );
    }
  };

  useEffect(() => {
    if (sessionId) {
      console.log(
        "Session ID available, calling createCustomerAndEsim with sessionId:",
        sessionId,
      );
      createCustomerAndEsim(sessionId);
    }
  }, [sessionId]);

  return (
    <div class="successfulPayment">
      <h1>Payment successful!</h1>
      <p>Your customer record and eSIM(s) will be created and emailed soon.</p>
    </div>
  );
};

export default SuccessPage;
