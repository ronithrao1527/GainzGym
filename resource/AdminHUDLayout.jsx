import React, { useState } from 'react';
import { LayoutDashboard, Users, Calendar, Award, Inbox, X } from 'lucide-react';

/*
  REUSABLE ADMIN PANEL OVERLAY HUD LAYOUT
  - 28% Sidebar tab navigation grid, 72% Content pane layout
  - Clean light surfaces, border treatments, and full overlays
  - Mobile responsive stacked viewports
*/
export default function AdminHUDLayout({
  tabs = [
    { id: 'inquiries', label: 'Inquiries', icon: Inbox },
    { id: 'prices', label: 'Pricing Plan Rates', icon: Award },
    { id: 'trainers', label: 'Coaches Directory', icon: Users },
    { id: 'schedules', label: 'Weekly Timetables', icon: Calendar }
  ],
  title = "Admin Control Center",
  subtitle = "Manage platform inventory, pricing, and view client inquiries.",
  onClose,
  children
}) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  return (
    <div className="admin-overlay">
      <div className="admin-container">
        
        {/* Close Button */}
        <button className="close-btn" onClick={onClose} aria-label="Close panel">
          <X size={20} />
        </button>

        {/* Dashboard Header */}
        <div className="admin-hud-header">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <div className="admin-dashboard-grid">
          
          {/* Left Column: Sidebar Tab selection */}
          <div className="admin-sidebar">
            {tabs.map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <IconComp size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Main Data details pane */}
          <div className="admin-main-pane">
            {/* Inject custom tables, forms, or data list relative to activeTab state */}
            {React.Children.map(children, child => {
              if (React.isValidElement(child) && child.props.tabId === activeTab) {
                return child;
              }
              return null;
            })}
          </div>

        </div>
      </div>

      <style>{`
        .admin-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }

        .admin-container {
          position: relative;
          background: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: 24px;
          width: 100%;
          max-width: 1100px;
          height: 85vh;
          max-height: 800px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          padding: 30px;
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .close-btn {
          position: absolute;
          top: 25px;
          right: 25px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .close-btn:hover {
          color: var(--text-primary);
          transform: scale(1.1);
        }

        .admin-hud-header {
          margin-bottom: 24px;
        }

        .admin-hud-header h2 {
          font-size: 2rem;
          text-transform: uppercase;
        }

        .admin-hud-header p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .admin-dashboard-grid {
          display: grid;
          grid-template-columns: 0.28fr 0.72fr;
          gap: 24px;
          flex: 1;
          overflow: hidden;
        }

        .admin-sidebar {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sidebar-tab {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 14px 20px;
          border-radius: 12px;
          cursor: pointer;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: var(--transition-smooth);
          text-align: left;
          outline: none;
        }

        .sidebar-tab:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .sidebar-tab.active {
          background: rgba(var(--accent-gold-rgb), 0.08);
          color: var(--accent-gold);
          border-color: var(--accent-gold);
          box-shadow: none;
        }

        .admin-main-pane {
          overflow-y: auto;
          padding: 20px;
          position: relative;
          border: 1px solid var(--border-color);
          border-radius: 16px;
          background: var(--bg-primary);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .admin-container {
            height: 95vh;
            max-height: none;
            overflow-y: auto;
          }
          .admin-dashboard-grid {
            grid-template-columns: 1fr;
            overflow: visible;
          }
        }
      `}</style>
    </div>
  );
}
