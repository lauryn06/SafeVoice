"use client";
import { useEffect, useState } from "react";

type Case = {
  id: string;
  createdAt: string;
  urgencyLevel: string;
  region: string;
  status: string;
  aiSummary: string;
  abuseType: string;
};

export default function NgoDashboard() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cases")
      .then((res) => res.json())
      .then((data) => {
        setCases(data);
        setLoading(false);
      });
  }, []);

  const getBadgeColor = (level: string) => {
    if (level === "HIGH") return "badge-high";
    if (level === "MEDIUM") return "badge-medium";
    return "badge-low";
  };

  return (
    <main className="dashboard">
      <header className="dashHeader">
        <div className="dashLogo">🛡️ HerShield</div>
        <h1>NGO Dashboard</h1>
        <p>Incoming GBV case alerts</p>
      </header>

      {loading ? (
        <p className="loading">Loading cases...</p>
      ) : cases.length === 0 ? (
        <p className="loading">No cases yet.</p>
      ) : (
        <div className="caseGrid">
          {cases.map((c) => (
            <div key={c.id} className="caseCard">
              <div className="caseTop">
                <span className={`badge ${getBadgeColor(c.urgencyLevel)}`}>
                  {c.urgencyLevel}
                </span>
                <span className="caseDate">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="caseSummary">{c.aiSummary}</p>
              <div className="caseBottom">
                <span className="caseRegion">📍 {c.region || "Unknown"}</span>
                <span className="caseStatus">{c.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}