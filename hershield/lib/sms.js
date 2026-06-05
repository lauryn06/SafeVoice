const AfricasTalking = require("africastalking")

const at = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME || "sandbox",
})

const sms = at.SMS

export async function sendSms(to, message) {
  try {
    const result = await sms.send({
      to: [to],
      message,
      from: process.env.AT_SENDER_ID || null,
    })

    console.log("📱 SMS sent:", result)
    return { success: true, result }
  } catch (error) {
    console.error("SMS error:", error)
    return { success: false, error: error.message }
  }
}

export function buildNgoSms(caseData) {
  return `🚨 HerShield Alert

NEW GBV CASE REPORTED

Type: ${caseData.abuseType}
Urgency: ${caseData.urgencyLevel}
Location: ${caseData.region || "Unknown"}
Contact: ${caseData.contactNumber || "Anonymous"}

Summary: ${caseData.aiSummary}

Login to dashboard:
localhost:3000/ngo

Case ID: ${caseData.id}`
}

export function buildSurvivorSms(contactNumber) {
  return `💜 HerShield

You are so brave for reaching out.

Your report has been received and a trusted organisation has been notified. Help is on the way.

You are not alone. 💜

Emergency:
Police: 997
GBV Helpline: 116`
}