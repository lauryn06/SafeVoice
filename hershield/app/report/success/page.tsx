import { Shield } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="landing">
      <div className="card" style={{ textAlign: "center" }}>
        <div className="logoSection" style={{ justifyContent: "center" }}>
          <div className="logoCircle">
            <Shield size={28} />
          </div>
        </div>

        <div style={{ fontSize: "48px", margin: "1rem 0" }}>✅</div>

        <h1>Report Received</h1>

        <p style={{ fontSize: "15px", opacity: 0.8, margin: "1rem 0" }}>
          Your report has been securely submitted. A trusted NGO has been
          notified and will reach out to provide support.
        </p>

        <p style={{ fontSize: "15px", opacity: 0.8, marginBottom: "2rem" }}>
          You are not alone. Help is on the way. 💜
        </p>

        <Link href="/">
          <button className="helpBtn">Back to Home</button>
        </Link>

        <p className="emergency" style={{ marginTop: "1.5rem" }}>
          Emergency: <strong>10111</strong> &nbsp;|&nbsp; GBV Helpline:{" "}
          <strong>0800 428 428</strong>
        </p>
      </div>
    </div>
  );
}