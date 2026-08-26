require("dotenv").config();

const OpenAI = require("openai");

console.log("API KEY EXISTS:", !!process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  try {
    const response = await openai.responses.create({
      model: "gpt-5.6",
      input: "Say hello",
    });

    console.log("SUCCESS:");
    console.log(response.output_text);
  } catch (error) {
    console.log("FAILED");
    console.log("message:", error.message);
    console.log("status:", error.status);
    console.log("code:", error.code);
    console.log("type:", error.type);
  }
}

test();