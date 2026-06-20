import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  const role = (session?.user as { role?: string } | undefined)?.role

  if (!session || role !== "admin") {
    redirect("/admin/login")
  }

  return <>{children}</>
}