import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [
    totalCases,
    totalNgos,
    activeNgos,
    totalReports,
    highUrgencyCases,
    pendingCases,
    alertsSent,
    casesByAbuseType,
    casesByRegion,
    recentCases
  ] =  Promise.all([
    prisma.case.count(),
    prisma.ngo.count(),
    prisma.ngo.count({ where: { isActive: true } }),
    prisma.report.count(),
    prisma.case.count({ where: { urgencyLevel: "HIGH" } }),
    prisma.case.count({ where: { status: "PENDING" } }),
    prisma.ngoAlert.count(),
    prisma.case.groupBy({
      by: ["abuseType"],
      _count: { abuseType: true }
    }),
    prisma.case.groupBy({
      by: ["region"],
      _count: { region: true }
    }),
    prisma.case.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        ngosAlerted: {
          include: { ngo: true }
        }
      }
    })
  ])

  return NextResponse.json({
    totalCases,
    totalNgos,
    activeNgos,
    totalReports,
    highUrgencyCases,
    pendingCases,
    alertsSent,
    casesByAbuseType: casesByAbuseType.map((c) => ({
      type: c.abuseType,
      count: c._count.abuseType
    })),
    casesByRegion: casesByRegion.map((c) => ({
      region: c.region || "Unknown",
      count: c._count.region
    })),
    recentCases
  })
}