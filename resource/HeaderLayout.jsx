import React, { useState } from 'react';
import { Dumbbell, Shield, LogOut, Menu } from 'lucide-react';

/*
  REUSABLE NAVIGATION HEADER LAYOUT
  - Fully responsive drawer on mobile sizes
  - Translucent glassmorphic overlay surface
  - Clean logo integration
*/
export default function HeaderLayout({ logoName = "GAINZ", logoSuffix = "GYM", isAdmin = false, onAdminClick, onLogoutClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="main-header">
      <div className="header-container">
        
        {/* Brand Logo */}
        <a href="#" className="logo-area">
          <Dumbbell className="logo-icon" />
          <span className="logo-text">{logoName}<span>{logoSuffix}</span></span>
        </a>
        
        {/* Mobile menu toggle */}
        <button 
          className="mobile-menu-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation bar links */}
        <nav className={`nav-bar ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#hero-section" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="#plans-section" onClick={() => setMobileMenuOpen(false)}>Memberships</a>
          <a href="#trainers-section" onClick={() => setMobileMenuOpen(false)}>Trainers</a>
          <a href="#schedule-section" onClick={() => setMobileMenuOpen(false)}>Schedules</a>
          <a href="#equipment-section" onClick={() => setMobileMenuOpen(false)}>Equipment</a>
          <a href="#gallery-section" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
          
          {isAdmin ? (
            <>
              <button className="nav-admin-btn" onClick={onAdminClick}>
                <Shield size={14} /> Admin Panel
              </button>
              <button className="nav-logout-btn" onClick={onLogoutClick} aria-label="Sign out">
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <button className="nav-portal-btn" onClick={onAdminClick}>
              Admin Login
            </button>
          )}
          
          <a href="#contact-section" className="nav-contact-btn" onClick={() => setMobileMenuOpen(false)}>Contact Us</a>
        </nav>
      </div>

      <style>{`
        .main-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          z-index: 100;
          height: 80px;
          transition: var(--transition-smooth);
        }

        .header-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        .logo-area {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          color: var(--accent-lime);
          width: 28px;
          height: 28px;
        }

        .logo-text {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.3rem;
          letter-spacing: 0.05em;
          color: var(--text-primary);
        }

        .logo-text span {
          color: var(--accent-cyan);
        }

        .nav-bar {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .nav-bar a {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-secondary);
          transition: var(--transition-smooth);
        }

        .nav-bar a:hover {
          color: var(--accent-cyan);
        }

        .nav-portal-btn {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 8px 16px;
          border-radius: 6px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .nav-portal-btn:hover {
          background: var(--text-primary);
          color: #ffffff;
          border-color: var(--text-primary);
        }

        .nav-admin-btn {
          background: rgba(var(--accent-gold-rgb), 0.08);
          border: 1px solid rgba(var(--accent-gold-rgb), 0.2);
          color: var(--accent-cyan);
          padding: 8px 16px;
          border-radius: 6px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition-smooth);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nav-admin-btn:hover {
          background: rgba(var(--accent-gold-rgb), 0.15);
        }

        .nav-logout-btn {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          width: 35px;
          height: 35px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .nav-logout-btn:hover {
          color: var(--accent-cyan);
          border-color: var(--accent-cyan);
          background: rgba(var(--accent-cyan-rgb), 0.04);
        }

        .nav-contact-btn {
          border: 1.5px solid var(--text-primary);
          padding: 8px 20px;
          border-radius: 6px;
          color: var(--text-primary) !important;
        }

        .nav-contact-btn:hover {
          background: var(--text-primary);
          color: #ffffff !important;
        }

        .mobile-menu-toggle {
          display: none;
          flex-direction: column;
          gap: 6px;
          width: 30px;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .mobile-menu-toggle span {
          display: block;
          height: 2px;
          width: 100%;
          background-color: var(--text-primary);
          border-radius: 2px;
          transition: var(--transition-smooth);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .nav-bar {
            gap: 16px;
          }
          .nav-bar a {
            font-size: 0.8rem;
          }
          .nav-portal-btn, .nav-admin-btn {
            padding: 6px 14px;
            font-size: 0.8rem;
          }
        }

        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: flex;
          }
          .nav-bar {
            position: fixed;
            top: 80px;
            left: 0;
            width: 100%;
            height: calc(100vh - 80px);
            background: var(--bg-primary);
            flex-direction: column;
            justify-content: center;
            gap: 32px;
            transform: translateX(100%);
            transition: var(--transition-smooth);
            z-index: 90;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          }
          .nav-bar.open {
            transform: translateX(0);
          }
          .nav-bar a {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </header>
  );
}
