// api/create-maya-customer.jsx
import { json } from "@remix-run/node";
import { createMayaCustomer } from "../utils/mayaApi";

export const action = async ({ request }) => {
  try {
    const { email, first_name, last_name, uid } = await request.json();

    if (!email || !first_name || !last_name) {
      console.warn("🚫 Missing customer fields", {
        email,
        first_name,
        last_name,
      });
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    const mayaCustomer = await createMayaCustomer(
      email,
      first_name,
      last_name,
      uid,
    );

    return json({
      mayaCustomer: {
        id: mayaCustomer.id,
        email: mayaCustomer.email,
        first_name: mayaCustomer.first_name,
        last_name: mayaCustomer.last_name,
      },
    });
  } catch (error) {
    console.error("❌ Error in create-maya-customer API:", error);
    return json(
      { error: error.message || "Unexpected error" },
      { status: 500 },
    );
  }
};
