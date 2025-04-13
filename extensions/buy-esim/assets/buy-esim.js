document.addEventListener("DOMContentLoaded", function () {
  let stripePromise;
  let activeRegion = "Europe";
  let selectedCountry = "All";

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
    Balkans: ["ALB", "BIH", "BGR", "HRV", "GRC", "XKX", "MKD", "MNE", "SRB"],
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

  const ISO3_TO_ISO2 = {
    AFG: "AF",
    ALB: "AL",
    DZA: "DZ",
    AND: "AD",
    AGO: "AO",
    ARG: "AR",
    ARM: "AM",
    AUS: "AU",
    AUT: "AT",
    AZE: "AZ",
    BHS: "BS",
    BHR: "BH",
    BGD: "BD",
    BRB: "BB",
    BLR: "BY",
    BEL: "BE",
    BLZ: "BZ",
    BEN: "BJ",
    BTN: "BT",
    BOL: "BO",
    BIH: "BA",
    BWA: "BW",
    BRA: "BR",
    BRN: "BN",
    BGR: "BG",
    BFA: "BF",
    BDI: "BI",
    KHM: "KH",
    CMR: "CM",
    CAN: "CA",
    CPV: "CV",
    CAF: "CF",
    TCD: "TD",
    CHL: "CL",
    CHN: "CN",
    COL: "CO",
    COM: "KM",
    COG: "CG",
    COD: "CD",
    CRI: "CR",
    CIV: "CI",
    HRV: "HR",
    CUB: "CU",
    CYP: "CY",
    CZE: "CZ",
    DNK: "DK",
    DJI: "DJ",
    DMA: "DM",
    DOM: "DO",
    ECU: "EC",
    EGY: "EG",
    SLV: "SV",
    GNQ: "GQ",
    ERI: "ER",
    EST: "EE",
    SWZ: "SZ",
    ETH: "ET",
    FJI: "FJ",
    FIN: "FI",
    FRA: "FR",
    GAB: "GA",
    GMB: "GM",
    GEO: "GE",
    DEU: "DE",
    GHA: "GH",
    GRC: "GR",
    GRD: "GD",
    GTM: "GT",
    GIN: "GN",
    GNB: "GW",
    GUY: "GY",
    HTI: "HT",
    HND: "HN",
    HUN: "HU",
    ISL: "IS",
    IND: "IN",
    IDN: "ID",
    IRN: "IR",
    IRQ: "IQ",
    IRL: "IE",
    ISR: "IL",
    ITA: "IT",
    JAM: "JM",
    JPN: "JP",
    JOR: "JO",
    KAZ: "KZ",
    KEN: "KE",
    KIR: "KI",
    KWT: "KW",
    KGZ: "KG",
    XKX: "XK", // Kosovo (ISO2 standard)
    LAO: "LA",
    LVA: "LV",
    LBN: "LB",
    LSO: "LS",
    LBR: "LR",
    LBY: "LY",
    LIE: "LI",
    LTU: "LT",
    LUX: "LU",
    MDG: "MG",
    MWI: "MW",
    MYS: "MY",
    MDV: "MV",
    MLI: "ML",
    MLT: "MT",
    MHL: "MH",
    MRT: "MR",
    MUS: "MU",
    MEX: "MX",
    FSM: "FM",
    MDA: "MD",
    MCO: "MC",
    MNG: "MN",
    MNE: "ME",
    MAR: "MA",
    MOZ: "MZ",
    MMR: "MM",
    NAM: "NA",
    NRU: "NR",
    NPL: "NP",
    NLD: "NL",
    NZL: "NZ",
    NIC: "NI",
    NER: "NE",
    NGA: "NG",
    MKD: "MK",
    NOR: "NO",
    OMN: "OM",
    PAK: "PK",
    PLW: "PW",
    PAN: "PA",
    PNG: "PG",
    PRY: "PY",
    PER: "PE",
    PHL: "PH",
    POL: "PL",
    PRT: "PT",
    QAT: "QA",
    ROU: "RO",
    RUS: "RU",
    RWA: "RW",
    KNA: "KN",
    LCA: "LC",
    VCT: "VC",
    SMR: "SM",
    SAU: "SA",
    SEN: "SN",
    SRB: "RS",
    SYC: "SC",
    SLE: "SL",
    SGP: "SG",
    SVK: "SK",
    SVN: "SI",
    SLB: "SB",
    SOM: "SO",
    ZAF: "ZA",
    KOR: "KR",
    ESP: "ES",
    LKA: "LK",
    SDN: "SD",
    SUR: "SR",
    SWE: "SE",
    CHE: "CH",
    SYR: "SY",
    TWN: "TW",
    TJK: "TJ",
    TZA: "TZ",
    THA: "TH",
    TLS: "TL",
    TGO: "TG",
    TON: "TO",
    TTO: "TT",
    TUN: "TN",
    TUR: "TR",
    TKM: "TM",
    TUV: "TV",
    UGA: "UG",
    UKR: "UA",
    ARE: "AE",
    GBR: "GB",
    USA: "US",
    URY: "UY",
    UZB: "UZ",
    VUT: "VU",
    VEN: "VE",
    VNM: "VN",
    YEM: "YE",
    ZMB: "ZM",
    ZWE: "ZW",
  };

  async function fetchStripeKey() {
    try {
      const response = await fetch("http://localhost:59995/api/settings", {
        headers: {
          Authorization: "Bearer W_U87e4JjWXfh2nfENRgsFJJmYQA",
        },
      });

      const settings = await response.json();

      if (!settings.stripePublishKey) throw new Error("Missing Stripe Key");

      stripePromise = Stripe(settings.stripePublishKey);
    } catch (error) {
      console.error("Error fetching Stripe key:", error.message);
    }
  }

  async function fetchProductsAndRegions() {
    try {
      document.getElementById("loading").style.display = "block";
      await fetchStripeKey();

      const [productsResponse, planTypesResponse] = await Promise.all([
        fetch("http://localhost:59995/api/products"),
        fetch("http://localhost:59995/api/get-plan-types"),
      ]);

      const [productsData, planTypesData] = await Promise.all([
        productsResponse.json(),
        planTypesResponse.json(),
      ]);

      const categorizedProducts = await Promise.all(
        productsData.map(async (product) => {
          const plan = planTypesData.planTypes.find(
            (p) => p.uid === product.metadata?.PlanID,
          );

          let productRegions = [];
          if (plan) {
            for (const [region, countries] of Object.entries(REGION_MAPPING)) {
              if (
                plan.countries_enabled.some((code) => countries.includes(code))
              ) {
                productRegions.push(region);
              }
            }
          }

          let priceAmount = "0.00";
          let priceCurrency = "USD";

          if (product.default_price) {
            try {
              const priceResponse = await fetch(
                `http://localhost:59995/api/prices?priceId=${product.default_price}`,
              );
              const priceData = await priceResponse.json();
              priceAmount = (priceData.unit_amount / 100).toFixed(2);
              priceCurrency = priceData.currency.toUpperCase();
            } catch (error) {
              console.error(`Error fetching price for ${product.id}:`, error);
            }
          }

          return {
            ...product,
            regions: productRegions,
            statesIncluded: plan?.countries_enabled.map(
              (code) => COUNTRY_NAMES[code] || code,
            ),
            priceAmount,
            priceCurrency,
          };
        }),
      );

      const groupedByRegion = Object.keys(REGION_MAPPING).reduce(
        (acc, region) => {
          acc[region] = categorizedProducts.filter((product) =>
            product.regions.includes(region),
          );
          return acc;
        },
        {},
      );

      displayRegions(groupedByRegion);
    } catch (error) {
      console.error("Error fetching products and regions:", error);
    } finally {
      document.getElementById("loading").style.display = "none";
    }
  }

  function displayRegions(groupedByRegion) {
    const regionTabs = document.querySelector(".region-tabs");
    regionTabs.innerHTML = "";

    Object.keys(groupedByRegion).forEach((region) => {
      const button = document.createElement("button");
      button.textContent = formatRegionName(region);
      button.classList.add("region-tab");
      if (region === activeRegion) button.classList.add("active");
      button.addEventListener("click", () => {
        activeRegion = region;
        selectedCountry = "All";
        displayProducts(groupedByRegion);
      });

      regionTabs.appendChild(button);
    });

    displayProducts(groupedByRegion);
  }

  function displayProducts(groupedByRegion) {
    const productGrid = document.querySelector(".product-grid");
    const countryFilter = document.getElementById("country-filter");

    productGrid.innerHTML = "";
    countryFilter.innerHTML = `<option value="All">All</option>`;

    if (
      !groupedByRegion[activeRegion] ||
      groupedByRegion[activeRegion].length === 0
    ) {
      productGrid.innerHTML = `<p class="no-products">No products available</p>`;
      return;
    }

    const availableCountries = new Set();
    groupedByRegion[activeRegion].forEach((product) => {
      product.statesIncluded.forEach((country) =>
        availableCountries.add(country),
      );
    });

    availableCountries.forEach((country) => {
      const option = document.createElement("option");
      option.value = country;
      option.textContent = country;
      countryFilter.appendChild(option);
    });

    groupedByRegion[activeRegion]
      .filter(
        (product) =>
          selectedCountry === "All" ||
          product.statesIncluded.includes(selectedCountry),
      )
      .forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product-card");

        const productTitle = product.name ? product.name : "";
        const productDescription = product.description
          ? product.description
          : "";

        const statesIncluded = product.statesIncluded;
        let stateListHTML = "";

        if (statesIncluded.length <= 6) {
          // Show all states if 6 or less
          stateListHTML = statesIncluded
            .map((countryName) => {
              const iso3Code = Object.keys(COUNTRY_NAMES).find(
                (code) => COUNTRY_NAMES[code] === countryName,
              );
              const iso2Code = ISO3_TO_ISO2[iso3Code] || iso3Code?.slice(0, 2);
              return `
              <span class="state-item">
                ${iso2Code ? `<img src="https://flagcdn.com/36x27/${iso2Code.toLowerCase()}.png" alt="${countryName}" class="flag-icon" />` : ""}
                ${countryName}
              </span>
            `;
            })
            .join("");
        } else {
          // Show first 6 states + "More States" tooltip
          const firstStates = statesIncluded.slice(0, 6);
          const remainingStates = statesIncluded.slice(6);

          stateListHTML = `
            <div class="state-tooltip-container">
              ${firstStates
                .map((countryName) => {
                  const iso3Code = Object.keys(COUNTRY_NAMES).find(
                    (code) => COUNTRY_NAMES[code] === countryName,
                  );
                  const iso2Code =
                    ISO3_TO_ISO2[iso3Code] || iso3Code?.slice(0, 2);
                  return `
                  <span class="state-item">
                    ${iso2Code ? `<img src="https://flagcdn.com/36x27/${iso2Code.toLowerCase()}.png" alt="${countryName}" class="flag-icon" />` : ""}
                    ${countryName}
                  </span>
                `;
                })
                .join("")}
              <span class="more-states"> +${remainingStates.length} More</span>
              <div class="state-tooltip">
                <ul class="state-tooltip-list">
                  ${remainingStates
                    .map((countryName) => {
                      const iso3 = Object.keys(COUNTRY_NAMES).find(
                        (code) => COUNTRY_NAMES[code] === countryName,
                      );
                      const iso2 = ISO3_TO_ISO2[iso3] || iso3?.slice(0, 2);
                      return `
                      <li class="tooltip-state-item">
                        ${iso2 ? `<img src="https://flagcdn.com/36x27/${iso2.toLowerCase()}.png" alt="${countryName}" class="flag-icon" />` : ""}
                        ${countryName}
                      </li>
                    `;
                    })
                    .join("")}
                </ul>
              </div>
            </div>
          `;
        }

        productDiv.innerHTML = `
          <h2 class="product-title">${productTitle}</h2>
          <p class="product-description">${productDescription}</p>
          ${product.images?.length ? `<img src="${product.images[0]}" alt="${product.productTitle}" class="product-image" />` : ""}
          <p class="product-price">Price: ${getCurrencySymbol(product.priceCurrency)} ${product.priceAmount}</p>
          <p class="product-states-title">Available Countries:</p>
          <div class="product-states">
            ${stateListHTML}
          </div>
          <button class="buy-button" data-price-id="${product.default_price}">Buy ${product.name}</button>
        `;

        productGrid.appendChild(productDiv);
      });
  }

  async function handleCheckout(priceId) {
    try {
      if (!stripePromise) throw new Error("Stripe is not initialized");
      const stripe = stripePromise;

      const response = await fetch(
        "http://localhost:59995/api/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId }),
        },
      );

      const data = await response.json();
      if (!data.sessionId) throw new Error("No session ID returned");

      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.error("Error during checkout:", error.message);
    }
  }

  function formatRegionName(region) {
    return region.replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  function getCurrencySymbol(currency) {
    const symbols = { USD: "$", EUR: "€", GBP: "£", JPY: "¥" };
    return symbols[currency] || currency;
  }

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("buy-button")) {
      const priceId = event.target.getAttribute("data-price-id");
      handleCheckout(priceId);
    }
  });

  document
    .getElementById("country-filter")
    .addEventListener("change", function (event) {
      selectedCountry = event.target.value;
      fetchProductsAndRegions();
    });

  fetchProductsAndRegions();
});
