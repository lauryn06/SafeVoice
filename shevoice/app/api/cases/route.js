import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const cases = await prisma.case.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        ngosAlerted: {
          include: { ngo: true }
        }
      }
    })
    return Response.json(cases)
  } catch (error) {
    console.error(error)
    return Response.json([], { status: 500 })
  }
}