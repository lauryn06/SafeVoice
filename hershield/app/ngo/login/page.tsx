"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

export default function NgoLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/ngo");
    }
  };

  return (
    <div className="landing">
      <div className="card" style={{ maxWidth: "420px" }}>
        <div className="logoSection">
          <div className="logoCircle">
            <Shield size={28} />
          </div>
          <h1>HerShield</h1>
        </div>

        <h2 style={{ marginBottom: "8px", marginLeft: "130px", fontSize: "1.2rem" }}>NGO Portal</h2>
        <p style={{ fontSize: "14px", opacity: 0.7, marginBottom: "1.5rem" }}>
          Sign in to view and manage incoming cases.
        </p>

        {error && (
          <div className="errorBox">{error}</div>
        )}

        <label>Email address</label>
        <input
          type="email"
          className="input"
          placeholder="your@ngo.org"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={{ marginTop: "10px" }}>Password</label>
        <input
          type="password"
          className="input"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <button
          className="helpBtn"
          style={{ marginTop: "1.5rem" }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In →"}
        </button>

        <p style={{ fontSize: "12px", opacity: 0.5, marginTop: "1rem", textAlign: "center" }}>
          Access restricted to verified NGO partners only.
        </p>
      </div>
    </div>
  );
}