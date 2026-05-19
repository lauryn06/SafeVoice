export default function ReportPage() {
  return (
    <div className="landing">
      <div className="card">
        <div className="logo">🛡️ HerShield</div>

        <h1>You are safe here.</h1>

        <p>
          This is a private, confidential space. Tell us what happened
          and we will connect you with people who can help — free,
          and judgment-free.
        </p>

        <div className="badges">
          <span>🔒 Anonymous option</span>
          <span>💬 Available 24/7</span>
          <span>🤝 Real NGO support</span>
        </div>

        <button>I need help →</button>

        <p className="emergency">
          In immediate danger? Call <strong>10111</strong> or{" "}
          <strong>0800 428 428</strong>
        </p>
      </div>
    </div>
  )
}