"use client";
import "./globals.css";
import { Mic, Bot, Shield, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSafeExit = () => {
    window.location.replace("https://www.google.com");
  };

  return (
    <main className="landingPage">
      <div className="backgroundGlowOne"></div>
      <div className="backgroundGlowTwo"></div>

      <nav className="navbar">
        <div className="logoSection">
          <div className="logoCircle">
            <Shield size={28} />
          </div>
          <h2>SheVoice</h2>
        </div>

        <button className="navButton" onClick={handleSafeExit}>
          Safe Exit
        </button>
      </nav>

      <section className="heroSection">
        <div className="heroContent">
          <span className="heroBadge">AI-Powered Protection For Girls</span>

          <h1 className="heroTitle">
            Your Voice Matters.
            <br />
            Your Safety Matters More.
          </h1>

          <p className="heroDescription">
            She voice AI helps girls experiencing gender-based violence report
            abuse safely, speak anonymously, and connect instantly with trusted
            NGOs and emergency support.
          </p>

          <div className="heroButtons">
            <button className="primaryButton" onClick={() => router.push('/report')}>
              File a Report
            </button>
            <button className="secondaryButton" onClick={() => router.push('/chat')}>
              Talk to our AI Assistant
            </button>
          </div>

          <div className="features">
            <div className="featureCard"><Mic size={18} /> Voice Reporting</div>
            <div className="featureCard"><Bot size={18} /> AI Risk Detection</div>
            <div className="featureCard"><Building2 size={18} /> NGO Alerts</div>
          </div>
        </div>

        <div className="heroImageSection">
          <div className="phoneMockup">
            <div className="phoneTop"></div>
            <div className="chatScreen">
              <div className="aiBubble">Hello 💜 Are you safe right now?</div>
              <div className="userBubble">I need help...</div>
              <div className="aiBubble">
                I'm here for you. Help resources are being prepared.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHASE 1 — now its own section, not a hero flex child */}
      <section className="phase1Section">
        <p className="phase1">
          You are not alone. Let your voice be heard!
        </p>
        <img src="/gbv3.jpg" alt="People supporting each other" className="image1" />
      </section>
 <h1>Talk to Others</h1>
      <section className="gallery">
       
        <img src="/gv 1.jpg" alt="" />
        <img src="/gbv2.jpg" alt="" />
      </section>


      {/* FOOTER */}

      <footer className="footer">
<br></br>
        
<p>  <div className="featureCard">
              <Mic size={18} /> Voice Reporting
            </div>
<br></br>
            <div className="featureCard">
              <Bot size={18} /> AI Risk Detection
            </div>
<br></br>
            <div className="featureCard">
              <Building2 size={18} /> NGO Alerts
            </div> <br></br></p>
      </footer>
            <p>Anonymous • Secure • AI Powered • Connected To Trusted NGOs</p>
    </main>
    
  );
}