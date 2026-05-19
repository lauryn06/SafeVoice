import "./globals.css";

export default function Home() {
  return (
    <main className="hero">

      {/* Dark Overlay */}
      <div className="overlay">

        {/* Main Card */}
        <section className="card">

          {/* Logo */}
          <div className="logo">
            💜
          </div>

          {/* Heading */}
          <h1 className="title">
            HerShield AI
          </h1>

          {/* Description */}
          <p className="description">
            A safe AI-powered support platform helping girls facing
            gender-based violence connect with trusted NGOs,
            emergency support, and real assistance.
          </p>

          {/* Buttons */}
          <div className="buttons">

            <button className="primaryBtn">
              I Need Help
            </button>

            <button className="secondaryBtn">
              Emergency Support
            </button>

            <button className="secondaryBtn">
              Learn About GBV
            </button>

          </div>

          {/* Privacy Box */}
          <div className="privacyBox">
            <p>
              🔒 Your conversations are private and secure.
              You may stay anonymous while getting help.
            </p>
          </div>

          {/* Footer */}
          <footer className="footer">
            Powered by AI • Connected to Verified NGOs
          </footer>

        </section>

      </div>

    </main>
  );
}