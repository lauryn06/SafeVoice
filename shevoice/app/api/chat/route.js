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

You help girls experiencing gender-based violence.

Your responsibilities:
- provide emotional support
-provide practical advice
-provide details for NGOs in the user's region
- provide information about local resources
-give first aid advice if needed
- ask calm questions
- identify danger severity
- encourage safety
- keep responses short and caring

You MUST return JSON ONLY.

Format:

{
  "reply":"your response",
  "dangerLevel":"LOW"
}

Danger levels:
- LOW
- MEDIUM
- HIGH

HIGH examples:
- rape
- bleeding
- severe beating
- threats to kill
- unsafe environment

MEDIUM examples:
- harassment
- emotional abuse
- slapping

LOW examples:
- fear
- anxiety
- confusion

DO NOT RETURN ANYTHING OUTSIDE JSON.
          `
        },

        {
          role: "user",
          content: userMessage
        }

      ]

    });

    const rawReply =
      response.choices[0].message.content;
      const cleanedReply = rawReply.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsedReply = JSON.parse(cleanedReply);

console.log("RAW REPLY:", rawReply); // 👈 add this
    return Response.json({

      reply: parsedReply.reply,

      dangerLevel:
        parsedReply.dangerLevel

    });

  } catch (error) {

    console.log(error);

    return Response.json({

      reply:
        "I'm here for you 💜",

      dangerLevel: "LOW"

    });

  }

}