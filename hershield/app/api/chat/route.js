import { Mistral } from "@mistralai/mistralai";

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function POST(req) {

  try {

    const body = await req.json();

    const userMessage = body.message;

    const response = await client.chat.complete({

      model: "mistral-small-latest",

      messages: [
        {
          role: "system",
          content: `
You are HerShield AI.

You are a calm and supportive assistant helping girls experiencing gender-based violence.

Your goals:
- ask helpful questions
- remain emotionally supportive
- identify danger levels
- ask for location if needed
- encourage contacting NGOs
- NEVER be aggressive
- keep responses short and caring
          `
        },

        {
          role: "user",
          content: userMessage
        }
      ]
    });

    return Response.json({
      reply: response.choices[0].message.content
    });

  } catch (error) {

    console.log(error);

    return Response.json({
      error: "Something went wrong"
    });

  }

}