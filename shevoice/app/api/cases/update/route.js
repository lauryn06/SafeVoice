import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { caseId, status } = await req.json()

    const updated = await prisma.case.update({
      where: { id: caseId },
      data: { status }
    })

    return Response.json({ success: true, status: updated.status })
  } catch (error) {
    console.error(error)
    return Response.json({ success: false }, { status: 500 })
  }
}