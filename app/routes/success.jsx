import React, { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "./styles/messages.css";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const hasRun = useRef(false); // Prevent duplicate runs in dev

  const createEsimAndAttachCustomer = async (sessionId) => {
    const alreadyProcessed = await fetch(
      `/api/check-checkout-session?session_id=${sessionId}`,
    );
    const result = await alreadyProcessed.json();

    if (result?.processed) {
      console.warn("⏭️ Session already processed, skipping eSIM creation.");
      return;
    }

    try {
      const stripeRes = await fetch(
        `/api/get-stripe-session?session_id=${sessionId}`,
      );
      const stripeData = await stripeRes.json();
      if (!stripeRes.ok) throw new Error(stripeData.error);

      const { email, name } = stripeData.customer_details || {};
      const lineItems = stripeData.line_items?.data || [];

      if (!email || !name || lineItems.length === 0) {
        throw new Error("Missing email, name, or line items.");
      }

      const [firstName, ...lastNameArr] = name.split(" ");
      const lastName = lastNameArr.join(" ");

      for (const item of lineItems) {
        const product = item.price.product;
        const planTypeId = product.metadata?.PlanID;

        if (!planTypeId) {
          console.warn("⚠️ Missing PlanID for product. Skipping...");
          continue;
        }

        const esimRes = await fetch("/api/create-esim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan_type_id: planTypeId }),
        });

        const esimText = await esimRes.text();
        let esimData;
        try {
          esimData = JSON.parse(esimText);
        } catch {
          console.error("❌ Failed to parse eSIM response");
          continue;
        }

        if (!esimRes.ok) {
          console.error(
            "❌ eSIM creation failed:",
            esimData?.error || esimText,
          );
          continue;
        }

        const { uid, qrCodeUrl, activation_code } = esimData;

        const customerRes = await fetch("/api/create-maya-customer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            first_name: firstName,
            last_name: lastName,
            iccid: uid,
          }),
        });

        const customerData = await customerRes.json();
        const customerId = customerData?.mayaCustomer?.id || customerData?.id;

        if (!customerId) {
          console.error("❌ Failed to retrieve Maya customer ID");
          continue;
        }

        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            qrCodeUrl,
            activationCode: activation_code,
            uid,
          }),
        });
      }

      // ✅ Mark session as processed
      await fetch("/api/mark-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
    } catch (err) {
      console.error("❌ Error in eSIM + customer flow:", err.message);
    }
  };

  useEffect(() => {
    if (sessionId && !hasRun.current) {
      hasRun.current = true;
      createEsimAndAttachCustomer(sessionId);
    }
  }, [sessionId]);

  return (
    <div className="successfulPayment">
      <h1>Payment successful!</h1>
      <p>Your eSIM(s) will be created and emailed shortly.</p>
    </div>
  );
};

export default SuccessPage;
