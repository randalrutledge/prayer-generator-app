// /home/ubuntu/prayer-generator-backend/api/generate-prayer.js
// Example Node.js backend function (e.g., for Vercel Serverless Functions)

// REMOVED: const fetch = require("node-fetch"); // Use Vercel's native fetch

// Allow CORS for all origins (adjust in production for security)
const allowCors = fn => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*"); // Or specific origin
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

const handler = async (req, res) => {
  // ADDED FOR DEBUGGING: Check if function is invoked
  console.log("--- generate-prayer function invoked ---"); 

  if (req.method !== "POST") {
    console.log("Method not allowed:", req.method);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Ensure req.body is parsed (Vercel usually does this automatically for JSON)
  let userInput;
  try {
    // Vercel might provide parsed body directly, or sometimes needs JSON.parse
    userInput = typeof req.body === 'string' ? JSON.parse(req.body).userInput : req.body.userInput;
  } catch (parseError) {
    console.error("Failed to parse request body:", parseError);
    console.error("Raw request body:", req.body);
    return res.status(400).json({ error: "Invalid request body format" });
  }
  
  console.log("Received userInput:", userInput); // Log received input

  if (!userInput) {
    console.log("User input missing.");
    return res.status(400).json({ error: "User input is required" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OpenAI API key not found in environment variables.");
    return res.status(500).json({ error: "Server configuration error" });
  }
  // Log part of the key to confirm it's loaded (DO NOT log the full key)
  console.log("OpenAI API Key loaded (first 5 chars):", apiKey.substring(0, 5));

  // The detailed prompt provided by the user
  const systemPrompt = `You are a prophetic intercessor trained on scripture, spiritual warfare manuals, and declarations from revivalists and deliverance ministers like Derek Prince and Daniel Duval. You have memorized foundational prayer structures. A user is in spiritual need. Based on the input below, generate a personalized, powerful prayer filled with compassion and biblical truth. Integrate direct or paraphrased scripture naturally. Include elements of repentance, surrender, alignment, spiritual authority, and breakthrough. Conclude with spiritual strength, peace, and a confident Amen. Keep it 600 characters or less. Respond in natural language.`;

  const userMessage = `User's situation: ${userInput}`;

  try {
    console.log("Attempting to call OpenAI API using native fetch...");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        // Recommend using gpt-4o for best capability/cost or gpt-4-turbo
        // Use gpt-3.5-turbo for lower cost if preferred
        model: "gpt-4o", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 150, // Adjust based on typical prayer length (~600 chars)
        temperature: 0.7, // Adjust for creativity vs consistency
      }),
    });

    console.log("OpenAI API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text(); // Get raw error text
      console.error("OpenAI API Error Status:", response.status);
      console.error("OpenAI API Error Response Text:", errorText);
      // Try to parse as JSON, but handle if it's not JSON
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (parseError) {
        console.error("Failed to parse OpenAI error response as JSON.");
        errorData = { message: errorText }; // Use raw text if not JSON
      }
      throw new Error(`OpenAI API error: ${response.statusText} - ${errorData.message || errorText}`);
    }

    const data = await response.json();
    console.log("OpenAI API response data received.");
    const prayer = data.choices[0]?.message?.content?.trim();

    if (!prayer) {
        console.error("No prayer content received from OpenAI:", JSON.stringify(data));
        throw new Error("Failed to generate prayer content.");
    }

    console.log("Prayer generated successfully. Sending response.");
    res.status(200).json({ prayer });

  } catch (error) {
    console.error("Error in handler function:", error.message);
    console.error("Stack trace:", error.stack);
    // Send a more generic error to the client, but log the details
    res.status(500).json({ error: "Failed to generate prayer due to an internal server error." });
  }
};

module.exports = allowCors(handler);

