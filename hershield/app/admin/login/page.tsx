"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await signIn("admin", {
      email,
      password,
      redirect: false
    })

    setLoading(false)

    if (res?.error) {
      setError("Invalid email or password.")
      return
    }

    router.push("/admin")
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
        padding: "24px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#15151f",
          border: "1px solid #2a2a38",
          borderRadius: "20px",
          padding: "40px 36px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #c026d3, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px"
            }}
          >
            🛡️
          </div>
          <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: 700, margin: 0 }}>
            HerShield
          </h1>
        </div>

        <h2
          style={{
            color: "#fff",
            fontSize: "18px",
            fontWeight: 600,
            margin: "8px 0 4px",
            textAlign: "center"
          }}
        >
          Admin Portal
        </h2>
        <p
          style={{
            color: "#9b9ba8",
            fontSize: "14px",
            textAlign: "center",
            margin: "0 0 24px"
          }}
        >
          Sign in to view platform-wide stats and manage NGOs.
        </p>

        {error && (
          <div
            style={{
              background: "rgba(220, 38, 38, 0.12)",
              border: "1px solid rgba(220, 38, 38, 0.4)",
              color: "#f87171",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "14px",
              marginBottom: "18px"
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ color: "#cfcfd8", fontSize: "13px", display: "block", marginBottom: "6px" }}>
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              background: "#1d1d29",
              border: "1px solid #34344a",
              borderRadius: "10px",
              padding: "12px 14px",
              color: "#fff",
              fontSize: "14px",
              marginBottom: "18px",
              outline: "none"
            }}
          />

          <label style={{ color: "#cfcfd8", fontSize: "13px", display: "block", marginBottom: "6px" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              background: "#1d1d29",
              border: "1px solid #34344a",
              borderRadius: "10px",
              padding: "12px 14px",
              color: "#fff",
              fontSize: "14px",
              marginBottom: "24px",
              outline: "none"
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading
                ? "#6d28d9"
                : "linear-gradient(135deg, #a21caf, #7c3aed)",
              border: "none",
              borderRadius: "10px",
              padding: "13px",
              color: "#fff",
              fontWeight: 600,
              fontSize: "15px",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p
          style={{
            color: "#71717f",
            fontSize: "12px",
            textAlign: "center",
            marginTop: "20px"
          }}
        >
          Access restricted to system administrators only.
        </p>
      </div>
    </div>
  )
}