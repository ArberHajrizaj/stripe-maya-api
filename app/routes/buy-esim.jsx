import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import "./styles/products.css";

let stripePromise;

// Comprehensive mapping of country codes to country names
const COUNTRY_NAMES = {
  AFG: "Afghanistan",
  ALB: "Albania",
  DZA: "Algeria",
  AND: "Andorra",
  AGO: "Angola",
  ARG: "Argentina",
  ARM: "Armenia",
  AUS: "Australia",
  AUT: "Austria",
  AZE: "Azerbaijan",
  BHS: "Bahamas",
  BHR: "Bahrain",
  BGD: "Bangladesh",
  BRB: "Barbados",
  BLR: "Belarus",
  BEL: "Belgium",
  BLZ: "Belize",
  BEN: "Benin",
  BTN: "Bhutan",
  BOL: "Bolivia",
  BIH: "Bosnia and Herzegovina",
  BWA: "Botswana",
  BRA: "Brazil",
  BRN: "Brunei",
  BGR: "Bulgaria",
  BFA: "Burkina Faso",
  BDI: "Burundi",
  KHM: "Cambodia",
  CMR: "Cameroon",
  CAN: "Canada",
  CPV: "Cape Verde",
  CAF: "Central African Republic",
  TCD: "Chad",
  CHL: "Chile",
  CHN: "China",
  COL: "Colombia",
  COM: "Comoros",
  COG: "Congo",
  COD: "Congo (Democratic Republic)",
  CRI: "Costa Rica",
  CIV: "Ivory Coast",
  HRV: "Croatia",
  CUB: "Cuba",
  CYP: "Cyprus",
  CZE: "Czech Republic",
  DNK: "Denmark",
  DJI: "Djibouti",
  DMA: "Dominica",
  DOM: "Dominican Republic",
  ECU: "Ecuador",
  EGY: "Egypt",
  SLV: "El Salvador",
  GNQ: "Equatorial Guinea",
  ERI: "Eritrea",
  EST: "Estonia",
  SWZ: "Eswatini",
  ETH: "Ethiopia",
  FJI: "Fiji",
  FIN: "Finland",
  FRA: "France",
  GAB: "Gabon",
  GMB: "Gambia",
  GEO: "Georgia",
  DEU: "Germany",
  GHA: "Ghana",
  GRC: "Greece",
  GRD: "Grenada",
  GTM: "Guatemala",
  GIN: "Guinea",
  GNB: "Guinea-Bissau",
  GUY: "Guyana",
  HTI: "Haiti",
  HND: "Honduras",
  HUN: "Hungary",
  ISL: "Iceland",
  IND: "India",
  IDN: "Indonesia",
  IRN: "Iran",
  IRQ: "Iraq",
  IRL: "Ireland",
  ISR: "Israel",
  ITA: "Italy",
  JAM: "Jamaica",
  JPN: "Japan",
  JOR: "Jordan",
  KAZ: "Kazakhstan",
  KEN: "Kenya",
  KIR: "Kiribati",
  KWT: "Kuwait",
  KGZ: "Kyrgyzstan",
  XKX: "Kosovo",
  LAO: "Laos",
  LVA: "Latvia",
  LBN: "Lebanon",
  LSO: "Lesotho",
  LBR: "Liberia",
  LBY: "Libya",
  LIE: "Liechtenstein",
  LTU: "Lithuania",
  LUX: "Luxembourg",
  MDG: "Madagascar",
  MWI: "Malawi",
  MYS: "Malaysia",
  MDV: "Maldives",
  MLI: "Mali",
  MLT: "Malta",
  MHL: "Marshall Islands",
  MRT: "Mauritania",
  MUS: "Mauritius",
  MEX: "Mexico",
  FSM: "Micronesia",
  MDA: "Moldova",
  MCO: "Monaco",
  MNG: "Mongolia",
  MNE: "Montenegro",
  MAR: "Morocco",
  MOZ: "Mozambique",
  MMR: "Myanmar",
  NAM: "Namibia",
  NRU: "Nauru",
  NPL: "Nepal",
  NLD: "Netherlands",
  NZL: "New Zealand",
  NIC: "Nicaragua",
  NER: "Niger",
  NGA: "Nigeria",
  MKD: "North Macedonia",
  NOR: "Norway",
  OMN: "Oman",
  PAK: "Pakistan",
  PLW: "Palau",
  PAN: "Panama",
  PNG: "Papua New Guinea",
  PRY: "Paraguay",
  PER: "Peru",
  PHL: "Philippines",
  POL: "Poland",
  PRT: "Portugal",
  QAT: "Qatar",
  ROU: "Romania",
  RUS: "Russia",
  RWA: "Rwanda",
  KNA: "Saint Kitts and Nevis",
  LCA: "Saint Lucia",
  VCT: "Saint Vincent and the Grenadines",
  SMR: "San Marino",
  SAU: "Saudi Arabia",
  SEN: "Senegal",
  SRB: "Serbia",
  SYC: "Seychelles",
  SLE: "Sierra Leone",
  SGP: "Singapore",
  SVK: "Slovakia",
  SVN: "Slovenia",
  SLB: "Solomon Islands",
  SOM: "Somalia",
  ZAF: "South Africa",
  KOR: "South Korea",
  ESP: "Spain",
  LKA: "Sri Lanka",
  SDN: "Sudan",
  SUR: "Suriname",
  SWE: "Sweden",
  CHE: "Switzerland",
  SYR: "Syria",
  TWN: "Taiwan",
  TJK: "Tajikistan",
  TZA: "Tanzania",
  THA: "Thailand",
  TLS: "Timor-Leste",
  TGO: "Togo",
  TON: "Tonga",
  TTO: "Trinidad and Tobago",
  TUN: "Tunisia",
  TUR: "Turkey",
  TKM: "Turkmenistan",
  TUV: "Tuvalu",
  UGA: "Uganda",
  UKR: "Ukraine",
  ARE: "United Arab Emirates",
  GBR: "United Kingdom",
  USA: "United States",
  URY: "Uruguay",
  UZB: "Uzbekistan",
  VUT: "Vanuatu",
  VEN: "Venezuela",
  VNM: "Vietnam",
  YEM: "Yemen",
  ZMB: "Zambia",
  ZWE: "Zimbabwe",
};

const REGION_MAPPING = {
  Africa: [
    "DZA",
    "AGO",
    "BEN",
    "BWA",
    "BFA",
    "BDI",
    "CMR",
    "CPV",
    "CAF",
    "TCD",
    "COM",
    "COG",
    "CIV",
    "DJI",
    "EGY",
    "GNQ",
    "ETH",
    "GAB",
    "GMB",
    "GHA",
    "GIN",
    "GNB",
    "KEN",
    "LSO",
    "LBR",
    "LBY",
    "MDG",
    "MWI",
    "MLI",
    "MRT",
    "MUS",
    "MAR",
    "MOZ",
    "NAM",
    "NER",
    "NGA",
    "RWA",
    "STP",
    "SEN",
    "SYC",
    "SLE",
    "SOM",
    "ZAF",
    "SSD",
    "SDN",
    "SWZ",
    "TZA",
    "TGO",
    "TUN",
    "UGA",
    "ZMB",
    "ZWE",
  ],
  Asia: [
    "AFG",
    "ARM",
    "AZE",
    "BHR",
    "BGD",
    "BTN",
    "BRN",
    "KHM",
    "CHN",
    "CYP",
    "GEO",
    "IND",
    "IDN",
    "IRN",
    "IRQ",
    "ISR",
    "JPN",
    "JOR",
    "KAZ",
    "KWT",
    "KGZ",
    "LAO",
    "LBN",
    "MYS",
    "MDV",
    "MNG",
    "MMR",
    "NPL",
    "PRK",
    "OMN",
    "PAK",
    "PHL",
    "QAT",
    "KOR",
    "SAU",
    "SGP",
    "LKA",
    "SYR",
    "TWN",
    "TJK",
    "THA",
    "TLS",
    "TUR",
    "TKM",
    "UZB",
    "VNM",
    "YEM",
  ],
  Europe: [
    "ALB",
    "AND",
    "AUT",
    "BLR",
    "BEL",
    "BIH",
    "BGR",
    "HRV",
    "CYP",
    "CZE",
    "DNK",
    "EST",
    "FRO",
    "FIN",
    "FRA",
    "DEU",
    "GIB",
    "GRC",
    "HUN",
    "ISL",
    "IRL",
    "ITA",
    "LVA",
    "LIE",
    "LTU",
    "LUX",
    "MLT",
    "MDA",
    "MCO",
    "MNE",
    "NLD",
    "MKD",
    "NOR",
    "POL",
    "PRT",
    "ROU",
    "SMR",
    "SRB",
    "SVK",
    "SVN",
    "ESP",
    "SWE",
    "CHE",
    "UKR",
    "GBR",
    "VAT",
    "XKX",
  ],
  NorthAmerica: [
    "USA",
    "CAN",
    "MEX",
    "BLZ",
    "CRI",
    "SLV",
    "GTM",
    "HND",
    "NIC",
    "PAN",
  ],
  SouthAmerica: [
    "ARG",
    "BOL",
    "BRA",
    "CHL",
    "COL",
    "ECU",
    "GUY",
    "PRY",
    "PER",
    "SUR",
    "URY",
    "VEN",
  ],
  CentralAmerica: ["BLZ", "CRI", "SLV", "GTM", "HND", "NIC", "PAN"],
  Pacific: [
    "AUS",
    "FJI",
    "KIR",
    "MHL",
    "FSM",
    "NRU",
    "NZL",
    "PLW",
    "PNG",
    "WSM",
    "SLB",
    "TON",
    "TUV",
    "VUT",
  ],
  MiddleEast: [
    "BHR",
    "EGY",
    "IRN",
    "IRQ",
    "ISR",
    "JOR",
    "KWT",
    "LBN",
    "OMN",
    "QAT",
    "SAU",
    "SYR",
    "ARE",
    "YEM",
  ],
};

export default function BuyESim() {
  const [products, setProducts] = useState([]);
  const [regions, setRegions] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("All");

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      default:
        return "";
    }
  };

  const fetchStripeKey = async () => {
    try {
      const response = await fetch("/api/settings");
      const settings = await response.json();
      if (!settings.stripePublishKey) {
        throw new Error("Stripe publishable key is missing in settings.");
      }
      stripePromise = loadStripe(settings.stripePublishKey);
    } catch (error) {
      console.error("Error fetching Stripe key:", error.message);
    }
  };

  useEffect(() => {
    async function fetchProductsAndRegions() {
      try {
        setLoading(true);

        const productsResponse = await fetch("/api/products");
        const productsData = await productsResponse.json();

        const planTypesResponse = await fetch("/api/get-plan-types");
        const planTypesData = await planTypesResponse.json();

        // Categorize products into regions and fetch price data
        const categorizedProducts = await Promise.all(
          productsData.map(async (product) => {
            const plan = planTypesData.planTypes.find(
              (plan) => plan.uid === product.metadata?.PlanID,
            );

            let region = "Unknown";
            if (plan) {
              for (const [reg, countries] of Object.entries(REGION_MAPPING)) {
                if (
                  plan.countries_enabled.some((country) =>
                    countries.includes(country),
                  )
                ) {
                  region = reg;
                  break;
                }
              }
            }

            // Fetch price data from Stripe
            let priceAmount = "0.00";
            let priceCurrency = "USD";

            if (product.default_price) {
              try {
                const priceResponse = await fetch(
                  `/api/prices?priceId=${product.default_price}`,
                );
                const priceData = await priceResponse.json();

                priceAmount = (priceData.unit_amount / 100).toFixed(2);
                priceCurrency = priceData.currency.toUpperCase();
              } catch (error) {
                console.error(
                  `Error fetching price for product ${product.id}:`,
                  error,
                );
              }
            }

            return {
              ...product,
              region,
              statesIncluded: plan?.countries_enabled.map(
                (code) => COUNTRY_NAMES[code] || code,
              ),
              priceAmount,
              priceCurrency,
            };
          }),
        );

        // Group products by regions
        const groupedByRegion = categorizedProducts.reduce((acc, product) => {
          if (!acc[product.region]) acc[product.region] = [];
          acc[product.region].push(product);
          return acc;
        }, {});

        setProducts(categorizedProducts);
        setRegions(groupedByRegion);
      } catch (error) {
        console.error("Error fetching products and regions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStripeKey().then(fetchProductsAndRegions);
  }, []);

  const handleCheckout = async (priceId) => {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.error("Error during checkout process:", error.message);
    }
  };

  const filteredProducts =
    selectedCountry === "All"
      ? products
      : products.filter((product) =>
          product.statesIncluded.includes(selectedCountry),
        );

  return (
    <div className="product-grid">
      <h1 className="product-grid-title">Buy eSIM</h1>
      {loading ? (
        <p className="loading-text">Loading products...</p>
      ) : (
        <>
          {/* Filter Dropdown */}
          <div className="filter-container">
            <label htmlFor="country-filter">Filter by Country:</label>
            <select
              id="country-filter"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="filter-dropdown"
            >
              <option value="All">All</option>
              {Object.values(COUNTRY_NAMES).map((countryName) => (
                <option key={countryName} value={countryName}>
                  {countryName}
                </option>
              ))}
            </select>
          </div>

          {/* Render Products by Region */}
          {Object.entries(regions).map(([region, regionProducts]) => (
            <div key={region} className="region-section">
              <h2 className="region-title">{region}</h2>
              <div className="region-products">
                {regionProducts
                  .filter((product) =>
                    selectedCountry === "All"
                      ? true
                      : product.statesIncluded.includes(selectedCountry),
                  )
                  .map((product) => (
                    <div key={product.id} className="product-card">
                      <h2 className="product-title">{product.name || ""}</h2>
                      <p className="product-description">
                        {product.description || ""}
                      </p>
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
                      <p className="product-states">
                        States Included:{" "}
                        <strong>{product.statesIncluded.join(", ")}</strong>
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
            </div>
          ))}
        </>
      )}
    </div>
  );
}
