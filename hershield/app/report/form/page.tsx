"use client";

import { useState } from "react";

export default function ReportFormPage() {
  const [anonymous, setAnonymous] = useState(true);

  return (
    <div className="landing">
      <div className="card" style={{ maxWidth: "600px" }}>

        <div className="logo">📝 Incident Report</div>

        <h2>Tell us what happened</h2>

        <p style={{ fontSize: "14px", opacity: 0.8 }}>
          Your information is protected and only shared with trusted support partners.
        </p>

        {/* INCIDENT TYPE */}
        <label>Type of incident</label>
        <select className="input">
          <option>Abuse</option>
          <option>Harassment</option>
          <option>Threat</option>
          <option>Domestic violence</option>
          <option>Other</option>
        </select>

        {/* DATE */}
        <label style={{ marginTop: "10px" }}>Date of incident</label>
        <input type="date" className="input" />

        {/* LOCATION */}
        <label style={{ marginTop: "10px" }}>Location (optional)</label>
        <input
          type="text"
          className="input"
          placeholder="City / Area / School / Workplace"
        />

        {/* DESCRIPTION */}
        <label style={{ marginTop: "10px" }}>Describe what happened</label>
        <textarea
          className="input"
          rows={6}
          placeholder="Write as much detail as you're comfortable sharing..."
        />

        {/* ANONYMOUS TOGGLE */}
        <div className="toggleRow">
          <label>
            <input
              type="checkbox"
              checked={anonymous}
              onChange={() => setAnonymous(!anonymous)}
            />
            Submit anonymously
          </label>
        </div>

        {/* CONTACT OPTION */}
        {!anonymous && (
          <div>
            <label>Email or phone (optional)</label>
            <input
              type="text"
              className="input"
              placeholder="so we can follow up"
            />
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          className="helpBtn"
          style={{ marginTop: "15px" }}
          onClick={() => alert("Report submitted securely (demo)")}
        >
          Submit Report
        </button>

        <p className="emergency">
          If you're in immediate danger, call <strong>10111</strong>
        </p>

      </div>
    </div>
  );
}