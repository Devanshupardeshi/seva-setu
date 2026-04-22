const { GoogleGenerativeAI } = require("@google/generative-ai");

async function checkModels() {
  const apiKey = "AIzaSyBjcxcS44RRlaFEm8Zxbvkqx_vcyHaZwx4";
  console.log("Using API Key from .env.local");
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const modelsToTry = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-2.5-flash"
  ];

  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hi, say test.");
      console.log(`  ✅ Success: ${modelName}`);
      console.log(`  Response: ${result.response.text().trim()}`);
    } catch (err) {
      console.log(`  ❌ Failed: ${modelName} - ${err.message}`);
    }
  }
}

checkModels();
