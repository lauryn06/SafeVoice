import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const params = new URLSearchParams(body)

    const sessionId = params.get("sessionId")
    const phoneNumber = params.get("phoneNumber")
    const text = params.get("text") || ""

    // Split input by * to track menu steps
    const input = text.split("*").filter(Boolean)
    const step = input.length

    let response = ""

    // ── STEP 0: Main menu ──
    if (text === "") {
      response = `CON Welcome to HerShield 🛡️
Report Gender-Based Violence safely.

Select type of abuse:
1. Physical Abuse
2. Sexual Abuse
3. Emotional Abuse
4. Harassment
5. Domestic Violence`
    }

    // ── STEP 1: Chose abuse type → show who to contact ──
    else if (step === 1) {
      const abuseTypes: Record<string, string> = {
        "1": "Physical Abuse",
        "2": "Sexual Abuse",
        "3": "Emotional Abuse",
        "4": "Harassment",
        "5": "Domestic Violence",
      }

      const chosen = abuseTypes[input[0]]

      if (!chosen) {
        response = `END Invalid option. Please dial *123# again.`
      } else {
        response = `CON You selected: ${chosen}

Who do you need help from?
1. NGO Support Organisation
2. Police (Emergency)
3. Health Centre
4. All of the above`
      }
    }

    // ── STEP 2: Chose help type → ask for confirmation ──
    else if (step === 2) {
      const helpTypes: Record<string, string> = {
        "1": "NGO Support",
        "2": "Police",
        "3": "Health Centre",
        "4": "All Services",
      }

      const chosen = helpTypes[input[1]]

      if (!chosen) {
        response = `END Invalid option. Please dial *123# again.`
      } else {
        response = `CON You selected: ${chosen}

Do you want to share your phone number so they can call you back?
1. Yes, share my number
2. No, stay anonymous`
      }
    }

    // ── STEP 3: Chose anonymous or not → confirm and save ──
    else if (step === 3) {
      const abuseTypes: Record<string, string> = {
        "1": "Physical Abuse",
        "2": "Sexual Abuse",
        "3": "Emotional Abuse",
        "4": "Harassment",
        "5": "Domestic Violence",
      }

      const helpTypes: Record<string, string> = {
        "1": "NGO Support",
        "2": "Police",
        "3": "Health Centre",
        "4": "All Services",
      }

      const abuseType = abuseTypes[input[0]] || "Unknown"
      const helpType = helpTypes[input[1]] || "Unknown"
      const shareNumber = input[2] === "1"

      // Save case to database
      await prisma.case.create({
        data: {
          abuseType: abuseType,
          description: `USSD report. Abuse: ${abuseType}. Help needed: ${helpType}.`,
          aiSummary: `USSD case. Survivor requested ${helpType} for ${abuseType}. ${shareNumber ? `Contact: ${phoneNumber}` : "Anonymous report."}`,
          urgencyLevel: input[0] === "2" ? "HIGH" : "MEDIUM",
          region: "Malawi",
          isAnonymous: !shareNumber,
          contactNumber: shareNumber ? phoneNumber : null,
          alertSent: true,
          alertSentAt: new Date(),
          status: "ALERTED",
        }
      })

      response = `END Thank you for reaching out. 💜

Your report has been received.
${shareNumber ? "An organisation will call you shortly." : "Help is being arranged anonymously."}

Emergency contacts:
Police: 997
GBV Helpline: 116`
    }

    // ── FALLBACK ──
    else {
      response = `END Something went wrong. Please dial *123# again.`
    }

    return new Response(response, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    })

  } catch (error) {
    console.error("USSD error:", error)
    return new Response("END Sorry, something went wrong. Please try again.", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    })
  }
}