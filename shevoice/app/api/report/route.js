import { PrismaClient } from "@prisma/client"
import Groq from "groq-sdk";
import { sendSms, buildNgoSms, buildSurvivorSms } from "@/lib/sms"

const prisma = new PrismaClient()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req) {
  try {
    const body = await req.json()
    const { incidentType, date, location, description, anonymous, contact } = body

    // Ask Mistral to assess the report
    const adviceResponse = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `You are a GBV case advisor. Assess this incident report and return JSON only:
{
  "urgencyLevel": "HIGH | MEDIUM | LOW",
  "ngoAdvice": "Professional advice for the NGO caseworker in 2-3 sentences",
  "recommendedActions": ["action 1", "action 2", "action 3"],
  "normalizedRegion": "the closest matching Malawi district or city name, properly capitalized (e.g. Blantyre, Mzuzu, Lilongwe, Zomba). If no location is mentioned or identifiable, return 'Not specified'."
}
  Use the raw location text AND the incident description to infer the region if needed.
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
      recommendedActions: [],
      normalizedRegion: location || "Not specified"
    }

    try { advice = JSON.parse(raw) } catch (e) {}

    // Save to database
    const newCase = await prisma.case.create({
      data: {
        abuseType: incidentType,
        description: description,
        aiSummary: advice.ngoAdvice,
        urgencyLevel: advice.urgencyLevel,
        region: advice.normalizedRegion,
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
      const ngoSms = await sendSms(ngo.phone, buildNgoSms(newCase))
      await prisma.ngoAlert.create({
        data: {
          caseId: newCase.id,
          ngoId: ngo.id,
          smsSent: ngoSms.success,
          smsStatus: ngoSms.success ? "SENT" : "FAILED"
        }
      })
    }
    if (!anonymous && contact) {
  await sendSms(contact, buildSurvivorSms())
  console.log(" Motivational SMS sent to survivor")
    }

    console.log(" Report submitted, case:", newCase.id)

    return Response.json({ success: true, caseId: newCase.id })

  } catch (error) {
    console.error("Report error:", error)
    return Response.json({ success: false }, { status: 500 })
  }
}