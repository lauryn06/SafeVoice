import { PrismaClient } from "@prisma/client"
import { Mistral } from "@mistralai/mistralai"

const prisma = new PrismaClient()
const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY })

export async function POST(req) {
  try {
    const body = await req.json()
    const { incidentType, date, location, description, anonymous, contact } = body

    // Ask Mistral to assess the report
    const adviceResponse = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "system",
          content: `You are a GBV case advisor. Assess this incident report and return JSON only:
{
  "urgencyLevel": "HIGH | MEDIUM | LOW",
  "ngoAdvice": "Professional advice for the NGO caseworker in 2-3 sentences",
  "recommendedActions": ["action 1", "action 2", "action 3"]
}
DO NOT return anything outside JSON.`
        },
        {
          role: "user",
          content: `Incident type: ${incidentType}. Description: ${description}`
        }
      ]
    })

    const raw = adviceResponse.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    let advice = {
      urgencyLevel: "MEDIUM",
      ngoAdvice: "Please review this case carefully.",
      recommendedActions: []
    }

    try { advice = JSON.parse(raw) } catch (e) {}

    // Save to database
    const newCase = await prisma.case.create({
      data: {
        abuseType: incidentType,
        description: description,
        aiSummary: advice.ngoAdvice,
        urgencyLevel: advice.urgencyLevel,
        region: location || "Not specified",
        isAnonymous: anonymous,
        contactNumber: contact || null,
        alertSent: true,
        alertSentAt: new Date(),
        status: "ALERTED",
      }
    })

    // Alert NGOs
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

    console.log(" Report submitted, case:", newCase.id)

    return Response.json({ success: true, caseId: newCase.id })

  } catch (error) {
    console.error("Report error:", error)
    return Response.json({ success: false }, { status: 500 })
  }
}