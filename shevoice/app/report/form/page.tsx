"use client";

import { useState,useEffect } from "react";
import { AlertTriangle, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReportFormPage() {
  const [anonymous, setAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [incidentType, setIncidentType] = useState("Abuse");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert("Please describe what happened.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incidentType,
          date,
          location,
          description,
          anonymous,
          contact: anonymous ? null : contact,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/report/success");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();
        const address = data.address || {};
        const detectedRegion =
          address.city || address.town || address.county || address.state || "";

        if (detectedRegion) {
          setLocation(detectedRegion);
        }
      } catch (err) {
        console.error("Reverse geocode failed:", err);
      }
    },
    (error) => {
      console.warn("Geolocation permission denied or unavailable:", error);
      // silently falls back to manual typing — no need to alert the user
    }
  );
}, []);

  return (
    <div className="landing">
      <div className="card" style={{ maxWidth: "600px" }}>
        <div className="logoSection">
          <div className="logoCircle">
            <Shield size={28} />
          </div>
          <h1>SheVoice</h1>
        </div>

        <div className="logo">
          <AlertTriangle size={16} /> Incident Report
        </div>

        <h2>Tell us what happened</h2>

        <p style={{ fontSize: "14px", opacity: 0.8 }}>
          Your information is protected and only shared with trusted support partners.
        </p>

        <label>Type of incident</label>
        <select
          className="input"
          value={incidentType}
          onChange={(e) => setIncidentType(e.target.value)}
        >
          <option>Abuse</option>
          <option>Harassment</option>
          <option>Threat</option>
          <option>Domestic violence</option>
          <option>Other</option>
        </select>

        <label style={{ marginTop: "10px" }}>Date of incident</label>
        <input
          type="date"
          className="input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label style={{ marginTop: "10px" }}>Location (optional)</label>
        <input
          type="text"
          className="input"
          placeholder="City / Area / School / Workplace"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label style={{ marginTop: "10px" }}>Describe what happened</label>
        <textarea
          className="input"
          rows={6}
          placeholder="Write as much detail as you're comfortable sharing..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

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

        {!anonymous && (
          <div>
            <label>Email or phone (optional)</label>
            <input
              type="text"
              className="input"
              placeholder="so we can follow up"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
        )}

        <button
          className="helpBtn"
          style={{ marginTop: "15px" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>

        <p className="emergency">
          If you're in immediate danger, call <strong>10111</strong>
        </p>
      </div>
    </div>
  );
}