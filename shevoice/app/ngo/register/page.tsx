"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

export default function NgoRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword || !phone || !region) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ngo/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, region }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setLoading(false);
        return;
      }

      router.push("/ngo/login");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="landing">
      <div className="card" style={{ maxWidth: "420px" }}>
        <div className="logoSection">
          <div className="logoCircle">
            <Shield size={28} />
          </div>
          <h1>SheVoice</h1>
        </div>

        <h2 style={{ marginBottom: "8px", marginLeft: "100px", fontSize: "1.2rem" }}>
          NGO Registration
        </h2>
        <p style={{ fontSize: "14px", opacity: 0.7, marginBottom: "1.5rem" }}>
          Register your organization to receive and manage cases.
        </p>

        {error && <div className="errorBox">{error}</div>}

        <label>Organization name</label>
        <input
          type="text"
          className="input"
          placeholder="e.g. Hope Foundation"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label style={{ marginTop: "10px" }}>Email address</label>
        <input
          type="email"
          className="input"
          placeholder="your@ngo.org"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={{ marginTop: "10px" }}>Phone number</label>
        <input
          type="tel"
          className="input"
          placeholder="+265..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
<label style={{ marginTop: "10px" }}>Region</label>
<input
  type="text"
  className="input"
  placeholder="e.g. Mzuzu, Northern Region"
  value={region}
  onChange={(e) => setRegion(e.target.value)}
/>

        <label style={{ marginTop: "10px" }}>Password</label>
        <input
          type="password"
          className="input"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label style={{ marginTop: "10px" }}>Confirm password</label>
        <input
          type="password"
          className="input"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleRegister()}
        />

        <button
          className="helpBtn"
          style={{ marginTop: "1.5rem" }}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register →"}
        </button>

        <p style={{ fontSize: "12px", opacity: 0.5, marginTop: "1rem", textAlign: "center" }}>
          Already have an account? <a href="/ngo/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}