import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const body = await req.json()
    const { message, location, dangerLevel } = body

    // Save the case to database
    const newCase = await prisma.case.create({
      data: {
        abuseType: "reported via chat",
        description: message,
        aiSummary: `Danger level: ${dangerLevel}. Location: ${location}`,
        urgencyLevel: dangerLevel,
        region: location,
        isAnonymous: true,
        alertSent: true,
        alertSentAt: new Date(),
        status: "ALERTED",
      }
    })

    // Find NGOs to alert
    const ngos = await prisma.ngo.findMany({
      where: { isActive: true },
      take: 2
    })

    console.log(" ALERT SENT for case:", newCase.id)
    console.log("NGOs to notify:", ngos.map(n => n.name))

    // Log the alert records
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

    return Response.json({
      success: true,
      caseId: newCase.id,
      message: "Alert logged successfully"
    })

  } catch (error) {
    console.error("Alert error:", error)
    return Response.json({ success: false }, { status: 500 })
  }
}