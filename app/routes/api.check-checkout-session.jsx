import { json } from "@remix-run/node";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return json({ error: "Missing session ID" }, { status: 400 });
  }

  const exists = await prisma.processedCheckout.findUnique({
    where: { sessionId },
  });

  return json({ processed: !!exists });
};
