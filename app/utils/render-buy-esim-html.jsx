import React from "react";
import ReactDOMServer from "react-dom/server";
import BuyESim from "../routes/buy-esim";

export function renderBuyEsimToHTML() {
  try {
    const html = ReactDOMServer.renderToString(<BuyESim />);
    console.log("Rendered Buy eSIM HTML:", html); // Debugging line
    return html;
  } catch (error) {
    console.error("Error rendering Buy eSIM HTML:", error);
    throw error;
  }
}
