import { json } from "@remix-run/node";

export async function loader({ request }) {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);

    // Validate request is coming from Shopify (Optional, but recommended)
    const shopDomain = params.shop;
    if (!shopDomain || !shopDomain.endsWith(".myshopify.com")) {
        return json({ error: "Unauthorized request" }, { status: 401 });
    }

    return json({ message: "Shopify App Proxy is working!" }, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
    });
}
