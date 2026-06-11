import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCw, ShieldAlert, Cpu, Heart, CircleDot } from 'lucide-react';

// 3D Math Helper Functions for Holographic Projection
const rotateY = (x, y, z, angle) => {
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: x * cos + z * sin,
    y: y,
    z: -x * sin + z * cos
  };
};

const rotateX = (x, y, z, angle) => {
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: x,
    y: y * cos - z * sin,
    z: y * sin + z * cos
  };
};

const project = (x, y, z, width, height, cy) => {
  const fov = 360;      // Perspective field of view
  const distance = 280; // Camera distance
  const scale = fov / (z + distance);
  const sizeScale = 1.35; // Fine-tuned scale multiplier to match the static image size
  return {
    x: width / 2 + x * scale * sizeScale,
    y: cy + y * scale * sizeScale,
    scale: scale
  };
};

// Procedural 3D model coordinates (vertices, edges, and wireframe faces)
const getModelGeometry = (id) => {
  const normId = Number(id);

  if (normId === 1) {
    // Functional Trainer
    const vertices = [
      // Left vertical post
      { x: -45, y: 0, z: -15 }, { x: -45, y: 0, z: 15 },
      { x: -45, y: -120, z: -15 }, { x: -45, y: -120, z: 15 },
      // Right vertical post
      { x: 45, y: 0, z: -15 }, { x: 45, y: 0, z: 15 },
      { x: 45, y: -120, z: -15 }, { x: 45, y: -120, z: 15 },
      // Pull-up handles
      { x: -15, y: -130, z: 25 }, { x: 15, y: -130, z: 25 },
      // Weight stacks guide rods
      { x: -35, y: 0, z: 0 }, { x: -35, y: -100, z: 0 },
      { x: 35, y: 0, z: 0 }, { x: 35, y: -100, z: 0 },
      // Sliding cable pulleys
      { x: -45, y: -60, z: 15 }, { x: 45, y: -60, z: 15 }
    ];
    const edges = [
      [0, 1], [2, 3], [0, 2], [1, 3], // Left post outline
      [4, 5], [6, 7], [4, 6], [5, 7], // Right post outline
      [3, 8], [8, 9], [9, 7],         // Pull-up crossbar
      [10, 11], [12, 13]              // Weight guides
    ];
    // Generate weight stack plates dynamically
    for (let h = -10; h >= -80; h -= 10) {
      const vl = vertices.length;
      vertices.push({ x: -40, y: h, z: 0 }, { x: -30, y: h, z: 0 });
      edges.push([vl, vl + 1]);
      const vr = vertices.length;
      vertices.push({ x: 30, y: h, z: 0 }, { x: 40, y: h, z: 0 });
      edges.push([vr, vr + 1]);
    }
    // Connected cables
    const c1 = vertices.length;
    vertices.push({ x: -35, y: -80, z: 0 });
    edges.push([14, c1]);
    const c2 = vertices.length;
    vertices.push({ x: 35, y: -80, z: 0 });
    edges.push([15, c2]);
    
    return { vertices, edges };
  }

  if (normId === 2) {
    // Treadmill
    const vertices = [
      // Frame base
      { x: -25, y: 0, z: -60 }, { x: 25, y: 0, z: -60 },
      { x: 25, y: -10, z: 50 }, { x: -25, y: -10, z: 50 },
      // Running belt deck
      { x: -20, y: -12, z: -45 }, { x: 20, y: -12, z: -45 },
      { x: 20, y: -18, z: 35 }, { x: -20, y: -18, z: 35 },
      // Console upright support posts
      { x: -22, y: -12, z: 25 }, { x: -18, y: -75, z: 30 },
      { x: 22, y: -12, z: 25 }, { x: 18, y: -75, z: 30 },
      // Tilted console board
      { x: -22, y: -75, z: 30 }, { x: 22, y: -75, z: 30 },
      { x: 22, y: -90, z: 35 }, { x: -22, y: -90, z: 35 },
      // Left and right handrails
      { x: -18, y: -50, z: 5 }, { x: -18, y: -15, z: 5 },
      { x: 18, y: -50, z: 5 }, { x: 18, y: -15, z: 5 }
    ];
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Base
      [4, 5], [5, 6], [6, 7], [7, 4], // Belt deck
      [8, 9], [10, 11],               // Supports
      [12, 13], [13, 14], [14, 15], [15, 12], // Console Screen
      [9, 16], [16, 17],              // Left handrail
      [11, 18], [18, 19]              // Right handrail
    ];
    const faces = [
      [12, 13, 14, 15], // Console face
      [4, 5, 6, 7]      // Belt face
    ];
    return { vertices, edges, faces };
  }

  if (normId === 3) {
    // Power Cage
    const vertices = [
      // Base floor supports
      { x: -40, y: 0, z: -40 }, { x: 40, y: 0, z: -40 },
      { x: 40, y: 0, z: 40 }, { x: -40, y: 0, z: 40 },
      // Top cross rails
      { x: -40, y: -110, z: -40 }, { x: 40, y: -110, z: -40 },
      { x: 40, y: -110, z: 40 }, { x: -40, y: -110, z: 40 },
      // Spotter arms
      { x: -40, y: -45, z: -40 }, { x: -40, y: -45, z: 40 },
      { x: 40, y: -45, z: -40 }, { x: 40, y: -45, z: 40 },
      // Multi grip pull up handles
      { x: -15, y: -110, z: 40 }, { x: -10, y: -118, z: 50 },
      { x: 10, y: -118, z: 50 }, { x: 15, y: -110, z: 40 }
    ];
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Base outline
      [4, 5], [5, 6], [6, 7], [7, 4], // Top outline
      [0, 4], [1, 5], [2, 6], [3, 7], // Uprights
      [8, 9], [10, 11],               // Spotters
      [7, 12], [12, 13], [13, 14], [14, 15], [15, 6] // Pullup bar handles
    ];
    // Add post keyhole details
    for (let h = -20; h >= -90; h -= 10) {
      const idx = vertices.length;
      vertices.push({ x: -40, y: h, z: 40 }, { x: -37, y: h, z: 40 });
      edges.push([idx, idx + 1]);
      const idx2 = vertices.length;
      vertices.push({ x: 40, y: h, z: 40 }, { x: 37, y: h, z: 40 });
      edges.push([idx2, idx2 + 1]);
    }
    const faces = [[4, 5, 6, 7]];
    return { vertices, edges, faces };
  }

  if (normId === 4) {
    // Leg Press
    const vertices = [
      // Bottom frame base
      { x: -30, y: 0, z: -55 }, { x: 30, y: 0, z: -55 },
      { x: 30, y: 0, z: 55 }, { x: -30, y: 0, z: 55 },
      // Slanted slider rails
      { x: -25, y: -5, z: -45 }, { x: -25, y: -90, z: 40 },
      { x: 25, y: -5, z: -45 }, { x: 25, y: -90, z: 40 },
      // Footplate
      { x: -30, y: -80, z: 45 }, { x: 30, y: -80, z: 45 },
      { x: 30, y: -105, z: 35 }, { x: -30, y: -105, z: 35 },
      // Sliding Carriage (sled)
      { x: -26, y: -45, z: 0 }, { x: 26, y: -45, z: 0 },
      { x: 26, y: -55, z: -10 }, { x: -26, y: -55, z: -10 },
      // Lateral weight horns
      { x: -45, y: -50, z: -5 }, { x: 45, y: -50, z: -5 },
      // Tilted seat system
      { x: -20, y: -15, z: -35 }, { x: 20, y: -15, z: -35 },
      { x: 20, y: -50, z: -55 }, { x: -20, y: -50, z: -55 }
    ];
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Floor frame
      [4, 5], [6, 7],                 // Track rails
      [5, 2], [7, 3],                 // Vertical supports
      [8, 9], [9, 10], [10, 11], [11, 8], // Footplate
      [12, 13], [13, 14], [14, 15], [15, 12], // Sled
      [12, 16], [13, 17],             // Weight horn tubes
      [18, 19], [19, 20], [20, 21], [21, 18], // Seat backrest
      [18, 0], [19, 1]                // Lever locks
    ];
    const faces = [[8, 9, 10, 11], [18, 19, 20, 21]];
    return { vertices, edges, faces };
  }

  // Fallback box cage geometry
  const vertices = [
    { x: -30, y: 0, z: -30 }, { x: 30, y: 0, z: -30 },
    { x: 30, y: 0, z: 30 }, { x: -30, y: 0, z: 30 },
    { x: -30, y: -80, z: -30 }, { x: 30, y: -80, z: -30 },
    { x: 30, y: -80, z: 30 }, { x: -30, y: -80, z: 30 }
  ];
  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
  ];
  return { vertices, edges };
};

export default function Equipment360Viewer({ equipment, onClose, onInquireClick }) {
  const [rotation, setRotation] = useState(0); // in degrees
  const [tilt, setTilt] = useState(5); // in degrees (vertical tilt)
  const [isDragging, setIsDragging] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const startX = useRef(0);
  const startY = useRef(0);
  const startRotation = useRef(0);
  const startTilt = useRef(0);
  const canvasRef = useRef(null);

  // Sync image index based on rotation angle (mapping 360 degrees to 4 angles: 0, 90, 180, 270)
  useEffect(() => {
    // Normalize rotation to [0, 360)
    let normalized = ((rotation % 360) + 360) % 360;
    
    // Divide into 4 quadrants
    let index = 0;
    if (normalized >= 45 && normalized < 135) {
      index = 1; // 90 deg view
    } else if (normalized >= 135 && normalized < 225) {
      index = 2; // 180 deg view
    } else if (normalized >= 225 && normalized < 315) {
      index = 3; // 270 deg view
    } else {
      index = 0; // 0 deg (front) view
    }
    
    // Ensure we don't index out of bounds of rotation_photos array
    if (equipment.rotation_photos && equipment.rotation_photos.length > 0) {
      setActiveImageIndex(index % equipment.rotation_photos.length);
    }
  }, [rotation, equipment.rotation_photos]);

  // Draw a 3D Scanning Grid & Holographic Wireframe Model in Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw grid loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 50;
      const radius = Math.min(canvas.width, canvas.height) * 0.35;
      
      // Draw telemetry circle (pedestal base)
      ctx.strokeStyle = 'rgba(229, 192, 96, 0.18)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(197, 155, 39, 0.08)';
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.7, 0, Math.PI * 2);
      ctx.stroke();

      // Convert rotation and tilt to radians for pedestal animation
      const angleRad = (rotation * Math.PI) / 180;
      const tiltRad = (tilt * Math.PI) / 180;

      // Draw grid lines rotating on floor
      ctx.strokeStyle = 'rgba(229, 192, 96, 0.08)';
      ctx.lineWidth = 1;
      const lines = 12;
      for (let i = 0; i < lines; i++) {
        const lineAngle = angleRad + (i * Math.PI * 2) / lines;
        const xStart = cx + Math.cos(lineAngle) * radius;
        const yStart = cy + Math.sin(lineAngle) * radius * Math.cos(tiltRad);
        
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(xStart, yStart);
        ctx.stroke();
      }

      // Draw sweep line on floor
      const sweepAngle = angleRad;
      ctx.strokeStyle = 'rgba(229, 192, 96, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(
        cx + Math.cos(sweepAngle) * radius,
        cy + Math.sin(sweepAngle) * radius * Math.cos(tiltRad)
      );
      ctx.stroke();

      // Scanner Text
      ctx.font = '10px Space Grotesk';
      ctx.fillStyle = 'rgba(229, 192, 96, 0.5)';
      ctx.fillText(`ROTATION_Y: ${Math.round(rotation)}°`, 20, canvas.height - 40);
      ctx.fillText(`TILT_X: ${Math.round(tilt)}°`, 20, canvas.height - 25);
      ctx.fillText('SCAN_MODE: ACTIVE_3D_PHOTO', 20, canvas.height - 10);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [rotation, tilt, equipment.id]);

  // Drag Handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    startX.current = e.clientX;
    startY.current = e.clientY;
    startRotation.current = rotation;
    startTilt.current = tilt;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX.current;
    const deltaY = e.clientY - startY.current;
    
    // Sensitivity: 1px = 0.5 degrees rotation
    setRotation(startRotation.current + deltaX * 0.6);
    
    // Bound tilt between -15 and 30 degrees to keep it aesthetically pleasing
    const newTilt = startTilt.current - deltaY * 0.3;
    setTilt(Math.max(-15, Math.min(30, newTilt)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Handlers
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    startRotation.current = rotation;
    startTilt.current = tilt;
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startX.current;
    const deltaY = e.touches[0].clientY - startY.current;
    
    setRotation(startRotation.current + deltaX * 0.6);
    
    const newTilt = startTilt.current - deltaY * 0.3;
    setTilt(Math.max(-15, Math.min(30, newTilt)));
  };

  const getPerspectiveLabel = () => {
    let normalized = ((rotation % 360) + 360) % 360;
    if (normalized >= 45 && normalized < 135) return 'SIDE_VIEW (90°)';
    if (normalized >= 135 && normalized < 225) return 'REAR_VIEW (180°)';
    if (normalized >= 225 && normalized < 315) return 'SIDE_VIEW (270°)';
    return 'FRONT_VIEW (0°)';
  };

  // Build full photo URL
  const getImageUrl = (path) => {
    return path;
  };

  return (
    <div className="equipment-modal-overlay">
      <div className="equipment-modal-container">
        
        {/* Close Button */}
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </button>

        <div className="equipment-modal-grid">
          
          {/* Left Side: 360 Viewer */}
          <div className="viewer-pane">
            <canvas ref={canvasRef} className="scanning-canvas" />
            
            <div className="telemetry-hud">
              <span className="telemetry-tag"><Cpu size={12} /> SCAN TELEMETRY</span>
              <span className="telemetry-angle">{getPerspectiveLabel()}</span>
            </div>

            {/* Draggable Area */}
            <div 
              className={`360-viewport ${isDragging ? 'grabbing' : ''}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              {/* Draggable hint */}
              <div className="drag-hint">
                <RotateCw size={18} className="spin-icon" />
                <span>Drag to Rotate 360°</span>
              </div>

              {/* 3D Equipment Image wrapper with subtle 3D parallax tilt (not flattening out) */}
              <div 
                className="equipment-mesh-wrapper"
                style={{
                  transform: `perspective(1000px) rotateY(${rotation * 0.05}deg) rotateX(${tilt * 0.15}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.4s ease-out'
                }}
              >
                {equipment.rotation_photos && equipment.rotation_photos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={getImageUrl(photo)}
                    alt={`${equipment.name} angle ${idx}`}
                    className={`equipment-mesh-image ${idx === activeImageIndex ? 'active' : ''}`}
                    draggable="false"
                  />
                ))}
              </div>
            </div>

            {/* Manual Slider control */}
            <div className="control-rack">
              <label htmlFor="rotation-slider" className="sr-only">Rotate Equipment</label>
              <input 
                id="rotation-slider"
                type="range" 
                min="0" 
                max="360" 
                value={((Math.round(rotation) % 360) + 360) % 360} 
                onChange={(e) => setRotation(Number(e.target.value))}
                className="neon-range-slider"
              />
              <div className="angle-quick-clicks">
                <button onClick={() => setRotation(0)} className={activeImageIndex === 0 ? 'active' : ''}>Front</button>
                <button onClick={() => setRotation(90)} className={activeImageIndex === 1 ? 'active' : ''}>Right</button>
                <button onClick={() => setRotation(180)} className={activeImageIndex === 2 ? 'active' : ''}>Rear</button>
                <button onClick={() => setRotation(270)} className={activeImageIndex === 3 ? 'active' : ''}>Left</button>
              </div>
            </div>
          </div>

          {/* Right Side: Information Pane */}
          <div className="info-pane">
            <div className="category-meta">
              <span className="badge-neon cyan">{equipment.category}</span>
              <span className="muscle-targets">Targets: <strong>{equipment.muscle_groups}</strong></span>
            </div>

            <h2 className="equipment-title">{equipment.name}</h2>
            <p className="equipment-desc">{equipment.description}</p>

            <div className="tabs-container">
              <h3 className="tab-title"><CircleDot size={14} className="accent-lime-text" /> Key Benefits & Features</h3>
              <ul className="features-list">
                {equipment.features && equipment.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="specs-rack">
              <h3 className="tab-title"><Cpu size={14} className="accent-cyan-text" /> Engineering Specs</h3>
              <table className="specs-table">
                <tbody>
                  {equipment.specs && Object.entries(equipment.specs).map(([key, value]) => (
                    <tr key={key}>
                      <td className="spec-label">{key}</td>
                      <td className="spec-val">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="action-row">
              <button 
                className="btn btn-primary btn-block"
                onClick={() => {
                  onInquireClick(equipment.name);
                  onClose();
                }}
              >
                Inquire About This Equipment
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
          background: rgba(6, 7, 10, 0.85);
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
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          width: 100%;
          max-width: 1100px;
          height: 85vh;
          max-height: 800px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(229, 192, 96, 0.08);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
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
          background: var(--accent-cyan);
          color: var(--bg-primary);
          border-color: var(--accent-cyan);
          box-shadow: var(--shadow-neon-cyan);
          transform: rotate(90deg);
        }

        .equipment-modal-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          height: 100%;
        }

        /* Left side: Viewer */
        .viewer-pane {
          position: relative;
          background: #090a0d;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 24px;
          overflow: hidden;
        }

        .scanning-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 3;
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
          background: rgba(182, 255, 0, 0.08);
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid rgba(182, 255, 0, 0.15);
        }

        .360-viewport {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: grab;
          z-index: 2;
        }

        .360-viewport.grabbing {
          cursor: grabbing;
        }

        .drag-hint {
          position: absolute;
          top: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.6);
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.75rem;
          color: var(--text-secondary);
          pointer-events: none;
          opacity: 0.8;
          transition: var(--transition-smooth);
          z-index: 4;
        }

        .360-viewport:hover .drag-hint {
          opacity: 1;
          border-color: rgba(229, 192, 96, 0.4);
        }

        @keyframes spinAround {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-icon {
          animation: spinAround 4s infinite linear;
        }

        .equipment-mesh-wrapper {
          width: 80%;
          height: 80%;
          max-height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
          position: relative;
        }

        .equipment-mesh-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          position: absolute;
          opacity: 0;
          transition: opacity 0.15s ease-in-out;
          filter: drop-shadow(0 10px 20px rgba(229, 192, 96, 0.25));
          user-select: none;
          pointer-events: none;
        }

        .equipment-mesh-image.active {
          opacity: 1;
          position: relative;
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
          box-shadow: var(--shadow-neon-cyan);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .neon-range-slider::-webkit-slider-thumb:hover {
          background: var(--accent-lime);
          box-shadow: var(--shadow-neon-lime);
          transform: scale(1.2);
        }

        .angle-quick-clicks {
          display: flex;
          justify-content: space-between;
          gap: 8px;
        }

        .angle-quick-clicks button {
          flex: 1;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
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
          background: rgba(229, 192, 96, 0.12);
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        /* Right side: Info */
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

        .muscle-targets strong {
          color: var(--text-primary);
        }

        .equipment-title {
          font-size: 2.2rem;
          text-transform: uppercase;
          background: linear-gradient(135deg, #fff 30%, var(--text-secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
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

        .accent-lime-text { color: var(--accent-lime); }
        .accent-cyan-text { color: var(--accent-cyan); }

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
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
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

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Responsive */
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
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          }
          .info-pane {
            padding: 24px;
          }
          .equipment-mesh-wrapper {
            height: 220px;
          }
        }
      `}</style>
    </div>
  );
}
