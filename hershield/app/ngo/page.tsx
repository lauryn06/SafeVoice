"use client";
import { useEffect, useState } from "react";

type Ngo = { name: string; phone: string }
type Alert = { ngo: Ngo }
type Case = {
  id: string;
  createdAt: string;
  urgencyLevel: string;
  region: string;
  status: string;
  aiSummary: string;
  abuseType: string;
  description: string;
  ngosAlerted: Alert[];
};

export default function NgoDashboard() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Case | null>(null);

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

  const total = cases.length;
  const high = cases.filter((c) => c.urgencyLevel === "HIGH").length;
  const alerted = cases.filter((c) => c.status === "ALERTED").length;

  return (
    <main className="dashboard">
      <header className="dashHeader">
        <div className="dashLogo">🛡️ HerShield</div>
        <div>
          <h1>NGO Dashboard</h1>
          <p>Incoming GBV case alerts</p>
        </div>
      </header>

      {/* Stats */}
      <div className="dashStats">
        <div className="statCard">
          <div className="statNumber">{total}</div>
          <div className="statLabel">Total Cases</div>
        </div>
        <div className="statCard">
          <div className="statNumber">{high}</div>
          <div className="statLabel">High Urgency</div>
        </div>
        <div className="statCard">
          <div className="statNumber">{alerted}</div>
          <div className="statLabel">NGOs Alerted</div>
        </div>
      </div>

      {loading ? (
        <p className="loading">Loading cases...</p>
      ) : cases.length === 0 ? (
        <p className="loading">No cases yet.</p>
      ) : (
        <div className="caseGrid">
          {cases.map((c) => (
            <div
              key={c.id}
              className="caseCard"
              onClick={() => setSelected(c)}
            >
              <div className="caseTop">
                <span className={`badge ${getBadgeColor(c.urgencyLevel)}`}>
                  {c.urgencyLevel}
                </span>
                <span className="caseDate">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="caseType">
                {c.abuseType?.toUpperCase()} ABUSE
              </div>

              <p className="caseSummary">{c.aiSummary}</p>

              <div className="caseBottom">
                <span className="caseRegion">📍 {c.region || "Unknown"}</span>
                <span className="caseStatus">{c.status}</span>
              </div>

              {c.ngosAlerted?.length > 0 && (
                <div className="ngoTagRow">
                  {c.ngosAlerted.map((a, i) => (
                    <span key={i} className="ngoTag">
                      🤝 {a.ngo.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Case Detail Modal */}
      {selected && (
        <div className="modalOverlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modalClose" onClick={() => setSelected(null)}>✕</button>

            <div className="modalHeader">
              <span className={`badge ${getBadgeColor(selected.urgencyLevel)}`}>
                {selected.urgencyLevel}
              </span>
              <span className="caseDate">
                {new Date(selected.createdAt).toLocaleString()}
              </span>
            </div>

            <h2 className="modalTitle">
              {selected.abuseType?.toUpperCase()} ABUSE
            </h2>

            <div className="modalSection">
              <div className="modalLabel">📍 Location</div>
              <div className="modalValue">{selected.region || "Unknown"}</div>
            </div>

            <div className="modalSection">
              <div className="modalLabel">💬 Survivor's Report</div>
              <div className="modalValue">{selected.description}</div>
            </div>

            <div className="modalSection">
              <div className="modalLabel">🤖 AI Case Summary for NGO</div>
              <div className="modalValue">{selected.aiSummary}</div>
            </div>

            <div className="modalSection">
              <div className="modalLabel">🤝 NGOs Alerted</div>
              <div className="ngoTagRow">
                {selected.ngosAlerted?.map((a, i) => (
                  <span key={i} className="ngoTag">
                    {a.ngo.name} — {a.ngo.phone}
                  </span>
                ))}
              </div>
            </div>

            <div className="modalSection">
              <div className="modalLabel">📋 Status</div>
              <div className="modalValue">{selected.status}</div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}