import React from "react";
import ReactDOMServer from "react-dom/server";
import BuyESim from "./apps.buy-esim";

export async function loader() {
  const html = ReactDOMServer.renderToString(<BuyESim />);
  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
