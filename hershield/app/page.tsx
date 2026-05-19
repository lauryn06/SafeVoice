"use client";
import { use } from "react";
import "./globals.css";
import { Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { Bot } from "lucide-react";
import { Shield } from "lucide-react";
import { Building2 } from "lucide-react";

export default function Home() {
 const router = useRouter();
  return (

    <main className="landingPage">

      {/* BACKGROUND GLOW */}

      <div className="backgroundGlowOne"></div>
      <div className="backgroundGlowTwo"></div>

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logoSection">

          <div className="logoCircle">
            <Shield size={28} />
          </div>

          <h2>HerShield </h2>

        </div>

        <button className="navButton">
          Safe Exit
        </button>

      </nav>

      {/* HERO SECTION */}

      <section className="heroSection">

        {/* LEFT SIDE */}

        <div className="heroContent">

          <span className="badge">
            AI-Powered Protection For Girls
          </span>

          <h1 className="heroTitle">
            Your Voice Matters.
            <br />
            Your Safety Matters More.
          </h1>

          <p className="heroDescription">

            HerShield AI helps girls experiencing
            gender-based violence report abuse safely,
            speak anonymously, and connect instantly
            with trusted NGOs and emergency support.

          </p>

          {/* BUTTONS */}

          <div className="heroButtons">

            <button className="primaryButton"
           onClick={() => router.push('/report')}>
              Get Help Now
            </button>

            <button className="secondaryButton"
            onClick={() => router.push('/chat')}>
              Emergency Support
            </button>

          </div>

          {/* FEATURES */}

          <div className="features">

            <div className="featureCard">
              <Mic size={18} /> Voice Reporting
            </div>

            <div className="featureCard">
              <Bot size={18} /> AI Risk Detection
            </div>

            <div className="featureCard">
              <Building2 size={18} /> NGO Alerts
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="heroImageSection">

          <div className="phoneMockup">

            <div className="phoneTop"></div>

            <div className="chatScreen">

              <div className="aiBubble">
                Hello 💜 Are you safe right now?
              </div>

              <div className="userBubble">
                I need help...
              </div>

              <div className="aiBubble">
                I'm here for you.
                Help resources are being prepared.
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="footer">

        <p>
          Anonymous • Secure • AI Powered • Connected To Trusted NGOs
        </p>

      </footer>

    </main>

  );

}