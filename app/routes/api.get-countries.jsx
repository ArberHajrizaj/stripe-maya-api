import { json } from "@remix-run/node";

export const loader = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) {
      throw new Error("Failed to fetch country data.");
    }

    const countries = await response.json();

    // Generate COUNTRY_NAMES
    const COUNTRY_NAMES = {};
    countries.forEach((country) => {
      const iso3 = country.cca3; // ISO Alpha-3 code
      const name = country.name.common; // Full country name
      if (iso3 && name) {
        COUNTRY_NAMES[iso3] = name;
      }
    });

    // Generate REGION_MAPPING
    const REGION_MAPPING = {
      Africa: [],
      Asia: [],
      Europe: [],
      NorthAmerica: [],
      SouthAmerica: [],
      CentralAmerica: [],
      Pacific: [],
      MiddleEast: [],
    };

    countries.forEach((country) => {
      const iso3 = country.cca3; // ISO Alpha-3 code
      const region = country.region; // Main region
      const subregion = country.subregion || ""; // Subregion for finer granularity

      if (iso3 && region) {
        // Map to predefined regions
        if (region === "Africa") REGION_MAPPING.Africa.push(iso3);
        else if (region === "Asia") REGION_MAPPING.Asia.push(iso3);
        else if (region === "Europe") REGION_MAPPING.Europe.push(iso3);
        else if (region === "Americas") {
          // Split Americas into North, Central, and South America
          if (subregion.includes("Northern"))
            REGION_MAPPING.NorthAmerica.push(iso3);
          else if (subregion.includes("Central"))
            REGION_MAPPING.CentralAmerica.push(iso3);
          else REGION_MAPPING.SouthAmerica.push(iso3);
        } else if (region === "Oceania") REGION_MAPPING.Pacific.push(iso3);
        else if (region === "Middle East") REGION_MAPPING.MiddleEast.push(iso3);
      }
    });

    return json({ COUNTRY_NAMES, REGION_MAPPING });
  } catch (error) {
    console.error("Error fetching country data:", error.message);
    return json({ error: error.message }, { status: 500 });
  }
};
