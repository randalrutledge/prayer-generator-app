// /home/ubuntu/prayer-generator-backend/api/generate-prayer.js
// SIMPLIFIED FOR DEBUGGING - Returns fixed response, no OpenAI call

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
  // Log invocation
  console.log("--- generate-prayer function invoked (SIMPLIFIED DEBUG VERSION) ---"); 

  if (req.method !== "POST") {
    console.log("Method not allowed:", req.method);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Log the request body just in case
  console.log("Request body:", req.body);

  // Immediately return a fixed success response
  console.log("Sending fixed success response...");
  res.status(200).json({ prayer: "This is a fixed test response. If you see this, the function was invoked successfully, but the OpenAI call is bypassed." });

  // --- Original code commented out for debugging ---
  /*
  let userInput;
  try {
    userInput = typeof req.body === 'string' ? JSON.parse(req.body).userInput : req.body.userInput;
  } catch (parseError) {
    console.error("Failed to parse request body:", parseError);
    console.error("Raw request body:", req.body);
    return res.status(400).json({ error: "Invalid request body format" });
  }
  
  console.log("Received userInput:", userInput);

  if (!userInput) {
    console.log("User input missing.");
    return res.status(400).json({ error: "User input is required" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OpenAI API key not found in environment variables.");
    return res.status(500).json({ error: "Server configuration error" });
  }
  console.log("OpenAI API Key loaded (first 5 chars):", apiKey.substring(0, 5));

  const systemPrompt = `...`;
  const userMessage = `User's situation: ${userInput}`;

  try {
    console.log("Attempting to call OpenAI API using native fetch...");
    const response = await fetch("https://api.openai.com/v1/chat/completions", { ... });
    console.log("OpenAI API response status:", response.status);
    if (!response.ok) { ... }
    const data = await response.json();
    const prayer = data.choices[0]?.message?.content?.trim();
    if (!prayer) { ... }
    console.log("Prayer generated successfully. Sending response.");
    res.status(200).json({ prayer });
  } catch (error) {
    console.error("Error in handler function:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ error: "Failed to generate prayer due to an internal server error." });
  }
  */
};

module.exports = allowCors(handler);

