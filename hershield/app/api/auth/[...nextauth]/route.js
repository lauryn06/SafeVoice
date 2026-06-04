import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const ngo = await prisma.ngo.findUnique({
          where: { email: credentials.email }
        })

        if (!ngo) return null

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          ngo.password
        )

        if (!passwordMatch) return null

        return {
          id: ngo.id,
          name: ngo.name,
          email: ngo.email,
          region: ngo.region
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.region = user.region
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.region = token.region
        session.user.id = token.id
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