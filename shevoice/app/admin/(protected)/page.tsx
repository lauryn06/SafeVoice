"use client"

import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"
import Link from "next/link"

interface AbuseTypeCount {
  type: string
  count: number
}

interface RegionCount {
  region: string
  count: number
}

interface NgoAlertInfo {
  id: string
  ngo: { name: string }
}

interface CaseItem {
  id: string
  abuseType: string
  urgencyLevel: string
  region: string | null
  description: string
  aiSummary: string
  alertSent: boolean
  createdAt: string
  ngosAlerted: NgoAlertInfo[]
}

interface DashboardData {
  totalCases: number
  highUrgencyCases: number
  pendingCases: number
  totalNgos: number
  activeNgos: number
  alertsSent: number
  casesByAbuseType: AbuseTypeCount[]
  casesByRegion: RegionCount[]
  recentCases: CaseItem[]
}

const urgencyColor: Record<string, string> = {
  HIGH: "#f472b6",
  STANDARD: "#a78bfa",
  LOW: "#6b7280"
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        background: "#15151f",
        border: "1px solid #2a2a38",
        borderRadius: "16px",
        padding: "24px",
        textAlign: "center"
      }}
    >
      <div style={{ color: "#c026d3", fontSize: "34px", fontWeight: 700 }}>{value}</div>
      <div style={{ color: "#9b9ba8", fontSize: "12px", letterSpacing: "0.06em", marginTop: "4px" }}>
        {label.toUpperCase()}
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((json: DashboardData) => {
        setData(json)
        setLoading(false)
      })
  }, [])

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
            <p style={{ color: "#9b9ba8", fontSize: "13px", margin: 0 }}>
              Platform overview and case management
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link
            href="/admin/ngos"
            style={{
              color: "#cfcfd8",
              border: "1px solid #2a2a38",
              borderRadius: "10px",
              padding: "10px 18px",
              fontSize: "14px",
              textDecoration: "none"
            }}
          >
            Manage NGOs
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

      {loading && <p style={{ color: "#9b9ba8" }}>Loading dashboard…</p>}

      {!loading && data && (
        <>
          {/* Stat cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "18px",
              marginBottom: "32px"
            }}
          >
            <StatCard label="Total Cases" value={data.totalCases} />
            <StatCard label="High Urgency" value={data.highUrgencyCases} />
            <StatCard label="Pending" value={data.pendingCases} />
            <StatCard label="Total NGOs" value={data.totalNgos} />
            <StatCard label="Active NGOs" value={data.activeNgos} />
            <StatCard label="Alerts Sent" value={data.alertsSent} />
          </div>

          {/* Breakdown charts (simple bars, no extra libs) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "18px",
              marginBottom: "32px"
            }}
          >
            <div
              style={{
                background: "#15151f",
                border: "1px solid #2a2a38",
                borderRadius: "16px",
                padding: "20px"
              }}
            >
              <h3 style={{ color: "#9b9ba8", fontSize: "13px", letterSpacing: "0.06em", marginBottom: "16px" }}>
                BY ABUSE TYPE
              </h3>
              {data.casesByAbuseType.map((item: AbuseTypeCount) => (
                <div key={item.type} style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#cfcfd8", fontSize: "13px", marginBottom: "4px" }}>
                    <span>{item.type}</span>
                    <span>{item.count}</span>
                  </div>
                  <div style={{ background: "#2a2a38", borderRadius: "6px", height: "8px" }}>
                    <div
                      style={{
                        background: "linear-gradient(90deg, #c026d3, #7c3aed)",
                        height: "8px",
                        borderRadius: "6px",
                        width: `${Math.min(100, (item.count / data.totalCases) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "#15151f",
                border: "1px solid #2a2a38",
                borderRadius: "16px",
                padding: "20px"
              }}
            >
              <h3 style={{ color: "#9b9ba8", fontSize: "13px", letterSpacing: "0.06em", marginBottom: "16px" }}>
                BY REGION
              </h3>
              {data.casesByRegion.map((item: RegionCount) => (
                <div key={item.region} style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#cfcfd8", fontSize: "13px", marginBottom: "4px" }}>
                    <span>{item.region}</span>
                    <span>{item.count}</span>
                  </div>
                  <div style={{ background: "#2a2a38", borderRadius: "6px", height: "8px" }}>
                    <div
                      style={{
                        background: "linear-gradient(90deg, #f472b6, #c026d3)",
                        height: "8px",
                        borderRadius: "6px",
                        width: `${Math.min(100, (item.count / data.totalCases) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent cases */}
          <h2 style={{ color: "#fff", fontSize: "18px", marginBottom: "16px" }}>Recent Cases</h2>
          <div style={{ display: "grid", gap: "14px" }}>
            {data.recentCases.map((c: CaseItem) => (
              <div
                key={c.id}
                style={{
                  background: "#15151f",
                  border: "1px solid #2a2a38",
                  borderRadius: "14px",
                  padding: "18px 20px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span
                    style={{
                      background: urgencyColor[c.urgencyLevel] || "#a78bfa",
                      color: "#0a0a0f",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "6px",
                      letterSpacing: "0.04em"
                    }}
                  >
                    {c.urgencyLevel}
                  </span>
                  <span style={{ color: "#71717f", fontSize: "12px" }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h4 style={{ color: "#c026d3", fontSize: "14px", margin: "0 0 8px", textTransform: "uppercase" }}>
                  {c.abuseType}
                </h4>

                <p style={{ color: "#cfcfd8", fontSize: "13px", lineHeight: 1.5, margin: "0 0 12px" }}>
                  {c.aiSummary?.slice(0, 160) || c.description?.slice(0, 160)}
                  {(c.aiSummary?.length || c.description?.length) > 160 ? "…" : ""}
                </p>

                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ color: "#9b9ba8", fontSize: "12px" }}>
                    📍 {c.region || "Unknown"}
                  </span>
                  <span
                    style={{
                      background: c.alertSent ? "rgba(124,58,237,0.2)" : "rgba(107,114,128,0.2)",
                      color: c.alertSent ? "#c4b5fd" : "#9ca3af",
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: "6px"
                    }}
                  >
                    {c.alertSent ? "ALERTED" : "NOT ALERTED"}
                  </span>
                  {c.ngosAlerted.map((alert: NgoAlertInfo) => (
                    <span
                      key={alert.id}
                      style={{
                        background: "#2a2a38",
                        color: "#cfcfd8",
                        fontSize: "11px",
                        padding: "3px 10px",
                        borderRadius: "6px"
                      }}
                    >
                      {alert.ngo.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}