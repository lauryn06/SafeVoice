import { PrismaClient } from "@prisma/client"
import { Mistral } from "@mistralai/mistralai"

const prisma = new PrismaClient()
const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY })

export async function POST(req) {
  try {
    const body = await req.json()
    const { message, location, dangerLevel } = body

    // Ask Mistral to generate NGO action advice
    const adviceResponse = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "system",
          content: `You are a GBV case advisor for NGOs. Based on a survivor's message, return JSON only:
{
  "abuseType": "physical | sexual | emotional | financial | other",
  "recommendedActions": ["action 1", "action 2", "action 3"],
  "resourcesNeeded": ["e.g. shelter", "medical care", "legal aid", "counselling"],
  "ngoAdvice": "One paragraph of professional advice for the NGO caseworker"
}
DO NOT return anything outside JSON.`
        },
        {
          role: "user",
          content: message
        }
      ]
    })

    const raw = adviceResponse.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    let advice = {
      abuseType: "other",
      recommendedActions: [],
      resourcesNeeded: [],
      ngoAdvice: ""
    }

    try {
      advice = JSON.parse(raw)
    } catch (e) {
      console.error("Failed to parse advice:", e)
    }

    // Save full case to database
    const newCase = await prisma.case.create({
      data: {
        abuseType: advice.abuseType || "other",
        description: message,
        aiSummary: advice.ngoAdvice || `Danger level: ${dangerLevel}. Location: ${location}`,
        urgencyLevel: dangerLevel,
        region: location,
        isAnonymous: true,
        alertSent: true,
        alertSentAt: new Date(),
        status: "ALERTED",
      }
    })

    // Find NGOs and create alert records
    const ngos = await prisma.ngo.findMany({
      where: { isActive: true },
      take: 2
    })

    for (const ngo of ngos) {
      await prisma.ngoAlert.create({
        data: {
          caseId: newCase.id,
          ngoId: ngo.id,
          smsSent: false,
          smsStatus: "PENDING"
        }
      })
    }

    console.log("🚨 ALERT SENT for case:", newCase.id)
    console.log("📍 Location:", location)
    console.log("🏥 Abuse type:", advice.abuseType)
    console.log("✅ Recommended actions:", advice.recommendedActions)

    return Response.json({
      success: true,
      caseId: newCase.id,
      abuseType: advice.abuseType,
      recommendedActions: advice.recommendedActions,
      resourcesNeeded: advice.resourcesNeeded,
      ngoAdvice: advice.ngoAdvice
    })

  } catch (error) {
    console.error("Alert error:", error)
    return Response.json({ success: false }, { status: 500 })
  }
}