"use client";

import { useRouter } from "next/navigation";
import { Building2, Lock } from "lucide-react";
import { Zap } from "lucide-react";
import { Shield } from "lucide-react";


export default function ReportPage() {
  const router = useRouter();

  return (
    <div className="landing">
      <div className="card">

   <div className="logoSection">

          <div className="logoCircle">
            <Shield size={28} />

        </div>
          <h1>HerShield </h1>
        
        </div>

        <h1>You are safe here.</h1>

        <p>
          This is a confidential reporting space. You can report incidents
          of abuse, harassment, or threats safely and anonymously if needed.
        </p>

        <div className="badges">
          <span><Lock size={18} /> Anonymous reporting</span>
          <span><Zap size={18} /> Fast response routing</span>
          <span><Building2 size={18} /> NGO + emergency support</span>
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