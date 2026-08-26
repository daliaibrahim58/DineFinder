const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =====================================================
// Sleep
// =====================================================

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// =====================================================
// Generate Content With Retry
// =====================================================

const generateWithRetry = async (prompt, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`GEMINI REQUEST - Attempt ${attempt}/${retries}`);

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      return response;
    } catch (error) {
      console.error(`GEMINI ATTEMPT ${attempt} FAILED`);

      console.error("Status:", error?.status);
      console.error("Message:", error?.message);

      // Retry only temporary server errors
      if (error?.status !== 503 || attempt === retries) {
        throw error;
      }

      const delay = 1000 * Math.pow(2, attempt - 1);

      console.log(`Gemini unavailable. Retrying in ${delay}ms...`);

      await sleep(delay);
    }
  }
};

// =====================================================
// Parse Restaurant Query
// =====================================================

const parseRestaurantQuery = async (query) => {
  try {
    const prompt = `
You are an AI restaurant search filter parser.

Convert the user's natural language restaurant search into JSON.

Return ONLY valid JSON.
Do not return markdown.
Do not explain anything.

Use exactly these fields:

{
  "search": "",
  "cuisine": "",
  "area": "",
  "minPrice": null,
  "maxPrice": null,
  "minRating": null,
  "sort": "rating_desc"
}

Rules:

1. search:
Restaurant name or general search keyword.
Use "" if not mentioned.

2. cuisine:
Cuisine type such as:
Egyptian, Italian, French, Chinese, Indian,
Japanese, Seafood, Lebanese, International, etc.

Use "" if not mentioned.

3. area:
City or area.
Use "" if not mentioned.

4. minPrice:
Minimum numeric price if mentioned.
Use null if not mentioned.

5. maxPrice:
Maximum numeric price if mentioned.
Use null if not mentioned.

6. minRating:
Minimum rating.
Example:
"rating above 4" => 4
"rating 4.5 or higher" => 4.5

Use null if not mentioned.

7. sort:

Use:

"rating_desc"
for best/highest rated.

"price_asc"
for cheapest.

"price_desc"
for most expensive.

"distance"
for nearest.

Use "rating_desc" by default.

8. Nearby / location requests:

If the user says:

- near me
- nearby
- close to me
- closest restaurants
- المطاعم القريبة مني
- مطاعم قريبة
- أقرب مطاعم
- قريب مني

Set:

"sort": "distance"

Do not try to determine the user's location from the text.

User request:

"${query}"
`;

    console.log("AI QUERY:", query);

    const response = await generateWithRetry(prompt, 3);

    const text = response.text?.trim();

    console.log("GEMINI FILTER RESPONSE:", text);

    if (!text) {
      throw new Error("Gemini returned empty response");
    }

    // =====================================================
    // Clean JSON
    // =====================================================

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // =====================================================
    // Parse JSON
    // =====================================================

    let filters;

    try {
      filters = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("GEMINI INVALID JSON:");

      console.error(cleanText);

      throw new Error("Gemini returned invalid JSON");
    }

    // =====================================================
    // Normalize Filters
    // =====================================================

    return {
      search: filters.search || "",

      cuisine: filters.cuisine || "",

      area: filters.area || "",

      minPrice:
        filters.minPrice !== null && filters.minPrice !== undefined
          ? Number(filters.minPrice)
          : null,

      maxPrice:
        filters.maxPrice !== null && filters.maxPrice !== undefined
          ? Number(filters.maxPrice)
          : null,

      minRating:
        filters.minRating !== null && filters.minRating !== undefined
          ? Number(filters.minRating)
          : null,

      sort: filters.sort || "rating_desc",
    };
  } catch (error) {
    console.error("========== GEMINI FILTER ERROR ==========");

    console.error("Message:", error?.message);

    console.error("Status:", error?.status);

    console.error("Code:", error?.code);

    console.error("==========================================");

    throw error;
  }
};

module.exports = {
  generateWithRetry,
  parseRestaurantQuery,
};
