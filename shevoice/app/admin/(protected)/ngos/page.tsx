"use client"

import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"
import Link from "next/link"

interface NgoItem {
  id: string
  name: string
  email: string
  phone: string
  region: string
  isActive: boolean
  totalAlerts: number
}

export default function AdminNgosPage() {
  const [ngos, setNgos] = useState<NgoItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    loadNgos()
  }, [])

  async function loadNgos() {
    const res = await fetch("/api/admin/ngos")
    const json: { ngos: NgoItem[] } = await res.json()
    setNgos(json.ngos || [])
    setLoading(false)
  }

  async function toggleActive(id: string, current: boolean) {
    setUpdatingId(id)
    await fetch("/api/admin/ngos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !current })
    })
    await loadNgos()
    setUpdatingId(null)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", padding: "32px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          paddingBottom: "20px",
          borderBottom: "1px solid #2a2a38"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #c026d3, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px"
            }}
          >
            🛡️
          </div>
          <div>
            <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: 700, margin: 0 }}>
              SheVoice <span style={{ color: "#c026d3" }}>Admin</span>
            </h1>
            <p style={{ color: "#9b9ba8", fontSize: "13px", margin: 0 }}>NGO management</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link
            href="/admin"
            style={{
              color: "#cfcfd8",
              border: "1px solid #2a2a38",
              borderRadius: "10px",
              padding: "10px 18px",
              fontSize: "14px",
              textDecoration: "none"
            }}
          >
            ← Dashboard
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            style={{
              background: "transparent",
              border: "1px solid #2a2a38",
              borderRadius: "10px",
              padding: "10px 18px",
              color: "#cfcfd8",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <h2 style={{ color: "#fff", fontSize: "18px", marginBottom: "16px" }}>
        All NGOs ({ngos.length})
      </h2>

      {loading && <p style={{ color: "#9b9ba8" }}>Loading NGOs…</p>}

      {!loading && (
        <div
          style={{
            background: "#15151f",
            border: "1px solid #2a2a38",
            borderRadius: "16px",
            overflow: "hidden"
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1d1d29" }}>
                {["Name", "Email", "Phone", "Region", "Alerts Received", "Status", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      color: "#9b9ba8",
                      fontSize: "12px",
                      letterSpacing: "0.05em",
                      padding: "14px 18px",
                      borderBottom: "1px solid #2a2a38"
                    }}
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ngos.map((ngo) => (
                <tr key={ngo.id} style={{ borderBottom: "1px solid #232330" }}>
                  <td style={{ padding: "16px 18px", color: "#fff", fontSize: "14px", fontWeight: 600 }}>
                    {ngo.name}
                  </td>
                  <td style={{ padding: "16px 18px", color: "#cfcfd8", fontSize: "13px" }}>{ngo.email}</td>
                  <td style={{ padding: "16px 18px", color: "#cfcfd8", fontSize: "13px" }}>{ngo.phone}</td>
                  <td style={{ padding: "16px 18px", color: "#cfcfd8", fontSize: "13px" }}>{ngo.region}</td>
                  <td style={{ padding: "16px 18px", color: "#cfcfd8", fontSize: "13px" }}>{ngo.totalAlerts}</td>
                  <td style={{ padding: "16px 18px" }}>
                    <span
                      style={{
                        background: ngo.isActive ? "rgba(34,197,94,0.15)" : "rgba(107,114,128,0.2)",
                        color: ngo.isActive ? "#4ade80" : "#9ca3af",
                        fontSize: "12px",
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: "6px"
                      }}
                    >
                      {ngo.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "16px 18px" }}>
                    <button
                      onClick={() => toggleActive(ngo.id, ngo.isActive)}
                      disabled={updatingId === ngo.id}
                      style={{
                        background: "transparent",
                        border: "1px solid #2a2a38",
                        borderRadius: "8px",
                        padding: "6px 14px",
                        color: "#cfcfd8",
                        fontSize: "12px",
                        cursor: updatingId === ngo.id ? "not-allowed" : "pointer"
                      }}
                    >
                      {updatingId === ngo.id
                        ? "Updating…"
                        : ngo.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
              {ngos.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "24px 18px", color: "#71717f", textAlign: "center" }}>
                    No NGOs registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}