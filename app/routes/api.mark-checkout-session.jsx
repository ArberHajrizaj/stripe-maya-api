import { json } from "@remix-run/node";
import prisma from "../db.server";

export const action = async ({ request }) => {
  const { sessionId } = await request.json();

  if (!sessionId) {
    return json({ error: "Missing session ID" }, { status: 400 });
  }

  await prisma.processedCheckout.create({
    data: { sessionId },
  });

  return json({ success: true });
};
