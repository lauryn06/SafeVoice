import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") {
    return null
  }
  return session
}

export async function GET(req) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const ngos =  prisma.ngo.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { alerts: true }
      }
    }
  })

  const formatted = ngos.map((ngo) => ({
    id: ngo.id,
    name: ngo.name,
    email: ngo.email,
    phone: ngo.phone,
    region: ngo.region,
    isActive: ngo.isActive,
    totalAlerts: ngo._count.alerts
  }))

  return NextResponse.json({ ngos: formatted })
}

export async function PATCH(req) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { id, isActive } = body

  if (!id || typeof isActive !== "boolean") {
    return NextResponse.json({ error: "Missing id or isActive" }, { status: 400 })
  }

  const updated = await prisma.ngo.update({
    where: { id },
    data: { isActive }
  })

  return NextResponse.json({ ngo: updated })
}