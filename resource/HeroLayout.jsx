import React from 'react';
import { Activity, ArrowRight } from 'lucide-react';

/*
  REUSABLE HERO SECTION LAYOUT
  - Fully responsive layout
  - Clean light background image overlay with high-contrast content
  - Multi-column statistics highlight panel (relative flow on mobile, absolute flow on desktop)
*/
export default function HeroLayout({
  metaText = "THE GAINZ TEMPLE",
  title = "MAXIMIZE YOUR STRENGTH",
  description = "Equipped with state-of-the-art machinery, world-class trainers, and an inspiring high-tech atmosphere.",
  cta1Text = "Choose Your Plan",
  cta1Link = "#plans-section",
  cta2Text = "Explore Equipment",
  cta2Link = "#equipment-section",
  bgImage = "/images/gym_hero_bg.png",
  stats = [
    { value: "24/7", label: "Arena Access" },
    { value: "15+", label: "Elite Instructors" },
    { value: "30+", label: "Weekly Sessions" },
    { value: "100%", label: "Gainz Driven" }
  ]
}) {
  return (
    <section className="hero-banner" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="hero-bg-overlay"></div>
      
      <div className="container hero-content-wrapper">
        <div className="hero-meta">
          <Activity className="hero-meta-icon" size={16} />
          <span>{metaText}</span>
        </div>
        
        <h1 className="hero-title">{title}</h1>
        
        <p className="hero-desc">{description}</p>
        
        <div className="hero-ctas">
          <a href={cta1Link} className="btn btn-primary">
            {cta1Text} <ArrowRight size={16} />
          </a>
          <a href={cta2Link} className="btn btn-secondary">
            {cta2Text}
          </a>
        </div>
      </div>

      {/* Reusable Statistics Bar */}
      <div className="hero-highlights-bar">
        <div className="container highlights-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="highlight-item">
              <h3>{stat.value}</h3>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hero-banner {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-top: 100px;
          background-position: center center;
          background-size: cover;
          background-repeat: no-repeat;
          overflow: hidden;
        }

        .hero-bg-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.96) 100%);
          z-index: 1;
        }

        .hero-content-wrapper {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin-bottom: 80px;
        }

        .hero-meta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(var(--accent-gold-rgb), 0.08);
          color: var(--accent-cyan);
          border: 1px solid rgba(var(--accent-gold-rgb), 0.2);
          padding: 6px 16px;
          border-radius: 20px;
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          margin-bottom: 24px;
        }

        .hero-meta-icon {
          animation: pulse 1.5s infinite ease-in-out;
        }

        .hero-title {
          font-size: 4.5rem;
          line-height: 1.05;
          text-transform: uppercase;
          margin-bottom: 24px;
          color: #111111;
        }

        .hero-desc {
          font-size: 1.15rem;
          color: var(--text-secondary);
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .hero-ctas {
          display: flex;
          gap: 20px;
        }

        .hero-highlights-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          padding: 24px 0;
          z-index: 2;
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          text-align: center;
        }

        .highlight-item h3 {
          font-size: 2rem;
          color: var(--accent-gold);
        }

        .highlight-item span {
          font-family: var(--font-display);
          font-size: 0.85rem;
          text-transform: uppercase;
          color: var(--text-secondary);
          letter-spacing: 0.05em;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        /* Responsive Settings */
        @media (max-width: 900px) {
          .hero-title {
            font-size: 3.2rem;
          }
          .hero-desc {
            font-size: 1rem;
          }
        }

        @media (max-width: 768px) {
          .hero-banner {
            min-height: auto;
            padding-bottom: 0;
          }
          .hero-content-wrapper {
            margin-bottom: 40px;
            padding-top: 40px;
          }
          .hero-title {
            font-size: 2.5rem;
          }
          .hero-highlights-bar {
            position: relative;
            bottom: auto;
            left: auto;
            width: 100%;
            background: rgba(255, 255, 255, 0.9);
            border-top: 1px solid rgba(0, 0, 0, 0.08);
            padding: 20px 0;
            margin-top: 20px;
          }
          .highlights-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          .highlight-item h3 {
            font-size: 1.6rem;
          }
          .highlight-item span {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </section>
  );
}
