"use client";

import { useRouter } from "next/navigation";

export default function ReportPage() {
  const router = useRouter();

  return (
    <div className="landing">
      <div className="card">

        <div className="logo">🛡️ HerShield AI</div>

        <h1>You are safe here.</h1>

        <p>
          This is a confidential reporting space. You can report incidents
          of abuse, harassment, or threats safely and anonymously if needed.
        </p>

        <div className="badges">
          <span>🔒 Anonymous reporting</span>
          <span>⚡ Fast response routing</span>
          <span>🤝 NGO + emergency support</span>
        </div>

        <div style={{ marginTop: "20px" }}>
          <button
            className="helpBtn"
            onClick={() => router.push("/report/form")}
          >
            Start Report →
          </button>
        </div>

        <p className="emergency">
          Emergency: Call <strong>10111</strong> or{" "}
          <strong>0800 428 428</strong>
        </p>

      </div>
    </div>
  );
}