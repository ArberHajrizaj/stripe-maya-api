import { json } from "@remix-run/node";
import { renderBuyEsimToHTML } from "../utils/render-buy-esim-html"; 

export const loader = async () => {
  try {
    // Render Buy eSIM HTML
    const html = renderBuyEsimToHTML();

    // Return the HTML as JSON
    return json({ html });
  } catch (error) {
    console.error("Error rendering Buy eSIM to HTML:", error.message);
    return json({ error: error.message }, { status: 500 });
  }
};
