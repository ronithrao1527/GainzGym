import React, { useState } from 'react';
import { X, HelpCircle, Heart, Star, Sparkles } from 'lucide-react';

/*
  REUSABLE EQUIPMENT VISUALIZER MODAL LAYOUT
  - Dual columns split view template
  - Custom sliding slider controls & tilt triggers
  - Responsive layout (collapses to single column on mobile viewports)
*/
export default function EquipmentVisualizerLayout({
  equipment = {
    name: "Functional Cable Trainer",
    category: "Strength",
    muscle_groups: "Chest, Back, Arms, Core",
    description: "The ultimate multi-station cable machine for functional movement paths.",
    features: [
      "Dual 95kg weight stacks",
      "18 adjustable pulley positions",
      "Integrated multi-grip pull-up bar"
    ],
    specs: {
      Dimensions: "165 x 100 x 212 cm",
      Weight: "370 kg",
      Material: "11-gauge structural steel"
    },
    rotation_photos: [
      "/images/equipment/placeholder_0.jpg",
      "/images/equipment/placeholder_90.jpg",
      "/images/equipment/placeholder_180.jpg",
      "/images/equipment/placeholder_270.jpg"
    ]
  },
  onClose,
  onInquireClick
}) {
  const [rotation, setRotation] = useState(0); // 0 to 360
  const [activeAngleIndex, setActiveAngleIndex] = useState(0); // Quick selection angles

  const quickAngles = [
    { label: "Front (0°)", value: 0 },
    { label: "Side (90°)", value: 90 },
    { label: "Rear (180°)", value: 180 },
    { label: "Left (270°)", value: 270 }
  ];

  const handleAngleClick = (angle, idx) => {
    setRotation(angle);
    setActiveAngleIndex(idx);
  };

  return (
    <div className="equipment-modal-overlay">
      <div className="equipment-modal-container">
        
        {/* Close Button */}
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          <X size={22} />
        </button>

        <div className="equipment-modal-grid">
          
          {/* Left Column: Interactive 3D Visualizer Canvas Pane */}
          <div className="viewer-pane">
            <div className="telemetry-hud">
              <div className="telemetry-tag">
                <Sparkles size={14} className="spin-icon" />
                <span>3D ROTATION VIEW</span>
              </div>
              <div className="telemetry-angle">ROTATION: {rotation}°</div>
            </div>

            <div className="viewport-360">
              <div className="drag-hint">
                <HelpCircle size={14} />
                <span>Drag slider or click quick angles to rotate</span>
              </div>
              
              {/* Product Photo display wrapper */}
              <div className="equipment-image-wrapper">
                <img 
                  src={equipment.rotation_photos[Math.floor(rotation / 90) % 4]} 
                  alt={equipment.name} 
                  className="equipment-photo"
                  style={{
                    transform: `rotateY(${rotation * 0.05}deg)`
                  }}
                />
              </div>
            </div>

            {/* Slider Controls */}
            <div className="control-rack">
              <input 
                type="range" 
                min="0" 
                max="359" 
                value={rotation} 
                onChange={(e) => setRotation(Number(e.target.value))} 
                className="neon-range-slider"
              />
              
              <div className="angle-quick-clicks">
                {quickAngles.map((angle, idx) => (
                  <button 
                    key={idx}
                    className={activeAngleIndex === idx ? 'active' : ''}
                    onClick={() => handleAngleClick(angle.value, idx)}
                  >
                    {angle.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Spec Specifications List & Action Details Pane */}
          <div className="info-pane">
            <div className="category-meta">
              <span className="badge-neon lime">{equipment.category}</span>
              <div className="muscle-targets">
                Target: <strong>{equipment.muscle_groups}</strong>
              </div>
            </div>

            <h3 className="equipment-title">{equipment.name}</h3>
            <p className="equipment-desc">{equipment.description}</p>

            <div className="features-block">
              <h4 className="tab-title">
                <Star size={16} className="accent-lime-text" /> Highlights
              </h4>
              <ul className="features-list">
                {equipment.features.map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
            </div>

            <div className="specs-block">
              <h4 className="tab-title">
                <HelpCircle size={16} className="accent-cyan-text" /> Specifications
              </h4>
              <table className="specs-table">
                <tbody>
                  {Object.entries(equipment.specs).map(([label, val], idx) => (
                    <tr key={idx}>
                      <td className="spec-label">{label}</td>
                      <td className="spec-val">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Actions Row */}
            <div className="action-row">
              <button 
                className="btn btn-primary btn-block"
                onClick={() => onInquireClick && onInquireClick(equipment.name)}
              >
                Inquire Details
              </button>
              <button className="favorite-btn" aria-label="Add to favorites">
                <Heart size={20} />
              </button>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .equipment-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }

        .equipment-modal-container {
          position: relative;
          background: var(--bg-secondary);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 24px;
          width: 100%;
          max-width: 1100px;
          height: 85vh;
          max-height: 800px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.15);
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: var(--text-primary);
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: var(--transition-smooth);
        }

        .close-btn:hover {
          background: #111111;
          color: #ffffff;
          border-color: #111111;
          transform: rotate(90deg);
        }

        .equipment-modal-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          height: 100%;
        }

        .viewer-pane {
          position: relative;
          background: #f8f9fa;
          border-right: 1px solid rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 24px;
          overflow: hidden;
        }

        .telemetry-hud {
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 4;
          font-family: var(--font-display);
        }

        .telemetry-tag {
          font-size: 0.75rem;
          color: var(--accent-cyan);
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .telemetry-angle {
          font-size: 0.75rem;
          color: var(--accent-lime);
          font-weight: 600;
          background: rgba(var(--accent-gold-rgb), 0.08);
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid rgba(var(--accent-gold-rgb), 0.15);
        }

        .viewport-360 {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .drag-hint {
          position: absolute;
          top: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.9);
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          font-size: 0.75rem;
          color: var(--text-primary);
        }

        .equipment-image-wrapper {
          width: 80%;
          height: 80%;
          max-height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1000px;
        }

        .equipment-photo {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.1s ease-out;
          filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.08));
        }

        .control-rack {
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .neon-range-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          background: var(--bg-tertiary);
          border-radius: 2px;
          outline: none;
        }

        .neon-range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--accent-cyan);
          border: 2px solid var(--bg-primary);
          cursor: pointer;
        }

        .angle-quick-clicks {
          display: flex;
          gap: 8px;
        }

        .angle-quick-clicks button {
          flex: 1;
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(0, 0, 0, 0.05);
          color: var(--text-secondary);
          padding: 6px;
          border-radius: 6px;
          font-family: var(--font-display);
          font-size: 0.75rem;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .angle-quick-clicks button:hover,
        .angle-quick-clicks button.active {
          background: rgba(var(--accent-gold-rgb), 0.12);
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        .info-pane {
          padding: 40px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .category-meta {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .muscle-targets {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .equipment-title {
          font-size: 2.2rem;
          text-transform: uppercase;
        }

        .equipment-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .tab-title {
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .features-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .features-list li {
          font-size: 0.9rem;
          color: var(--text-secondary);
          padding-left: 20px;
          position: relative;
        }

        .features-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--accent-lime);
          font-weight: bold;
        }

        .specs-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .specs-table tr {
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .specs-table tr:last-child {
          border: none;
        }

        .specs-table td {
          padding: 8px 0;
        }

        .spec-label {
          color: var(--text-muted);
          width: 40%;
        }

        .spec-val {
          color: var(--text-primary);
          font-weight: 500;
        }

        .action-row {
          display: flex;
          gap: 16px;
          margin-top: auto;
          padding-top: 12px;
        }

        .btn-block {
          flex: 1;
          justify-content: center;
        }

        .favorite-btn {
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(0, 0, 0, 0.06);
          color: var(--text-secondary);
          border-radius: 8px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .favorite-btn:hover {
          color: #ff3e6c;
          border-color: rgba(255, 62, 108, 0.3);
          background: rgba(255, 62, 108, 0.05);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .equipment-modal-container {
            height: 95vh;
            max-height: none;
            overflow-y: auto;
          }
          .equipment-modal-grid {
            grid-template-columns: 1fr;
            height: auto;
          }
          .viewer-pane {
            height: 45vh;
            min-height: 320px;
            border-right: none;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          }
          .info-pane {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
}
