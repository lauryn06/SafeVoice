import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "ngo",
      name: "NGO Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const ngo = await prisma.ngo.findUnique({
          where: { email: credentials.email }
        })

        console.log("🔍 NGO found:", ngo?.name)

        if (!ngo) return null

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          ngo.password
        )

        console.log("🔐 Password match:", passwordMatch)

        if (!passwordMatch) return null

        return {
          id: ngo.id,
          name: ngo.name,
          email: ngo.email,
          region: ngo.region,
          role: "ngo"
        }
      }
    }),
    CredentialsProvider({
      id: "admin",
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminEmail || !adminPassword) {
          console.log("⚠️ ADMIN_EMAIL or ADMIN_PASSWORD not set in .env")
          return null
        }

        const emailMatch = credentials.email === adminEmail
        const passwordMatch = credentials.password === adminPassword

        console.log("🔐 Admin login attempt match:", emailMatch && passwordMatch)

        if (!emailMatch || !passwordMatch) return null

        return {
          id: "admin",
          name: "Administrator",
          email: adminEmail,
          role: "admin"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.region = user.region
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.region = token.region
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: "/ngo/login"
  },
  session: {
    strategy: "jwt"
  }
})

export { handler as GET, handler as POST }