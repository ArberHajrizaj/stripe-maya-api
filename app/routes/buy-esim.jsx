import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

export default function BuyESim() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishableKey, setPublishableKey] = useState(""); // Store publishable key

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      default:
        return ""; // Add more cases if needed for other currencies
    }
  };

  // Fetch settings and initialize Stripe
  const fetchStripeKey = async () => {
    try {
      console.log("Fetching Stripe publishable key...");
      const response = await fetch("/api/settings");
      if (!response.ok) {
        throw new Error("Failed to fetch API settings.");
      }
      const settings = await response.json();
      if (!settings.stripePublishKey) {
        throw new Error("Stripe publishable key is missing in settings.");
      }
      console.log("Stripe publishable key fetched successfully.");
      setPublishableKey(settings.stripePublishKey); // Save publishable key
      stripePromise = loadStripe(settings.stripePublishKey); // Initialize Stripe
    } catch (error) {
      console.error("Error fetching Stripe key:", error.message);
    }
  };

  // Fetch products and then fetch price details
  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log("Fetching products...");
        const response = await fetch("/api/products");
        const productsData = await response.json();

        // Fetch price details for each product
        const updatedProducts = await Promise.all(
          productsData.map(async (product) => {
            if (product.default_price) {
              const priceResponse = await fetch(
                `/api/prices?priceId=${product.default_price}`,
              );
              const priceData = await priceResponse.json();

              return {
                ...product,
                priceAmount: priceData.unit_amount / 100, // Convert to currency value
                priceCurrency: priceData.currency.toUpperCase(),
              };
            } else {
              return product;
            }
          }),
        );

        console.log("Products fetched successfully:", updatedProducts);
        setProducts(updatedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    }

    // Fetch the publishable key and products
    fetchStripeKey().then(fetchProducts);
  }, []);

  const handleCheckout = async (priceId) => {
    try {
      console.log("Handling checkout for priceId:", priceId);

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const rawResponse = await response.text();
      console.log("Raw response from create-checkout-session:", rawResponse);

      const data = JSON.parse(rawResponse);

      if (!data.sessionId) {
        console.error("Session ID missing in response:", data.error);
        alert(`Error: ${data.error}`);
        return;
      }

      console.log(
        "Redirecting to Stripe Checkout with sessionId:",
        data.sessionId,
      );

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.error("Error during checkout process:", error.message);
      alert(`Checkout error: ${error.message}`);
    }
  };

  return (
    <div className="product-grid">
      <h1 className="product-grid-title">Buy eSIM</h1>
      {loading ? (
        <p className="loading-text">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="no-products-text">No products available</p>
      ) : (
        <div className="product-container">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h2 className="product-title">{product.name || ""}</h2>
              <p className="product-description">{product.description || ""}</p>
              {product.images.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="product-image"
                />
              )}
              <p className="product-price">
                Price: {getCurrencySymbol(product.priceCurrency)}{" "}
                {product.priceAmount}
              </p>
              <button
                className="buy-button"
                onClick={() => handleCheckout(product.default_price)}
              >
                Buy {product.name}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
