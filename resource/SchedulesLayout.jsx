import React, { useState } from 'react';
import { Search, Calendar, Award, Clock, ArrowRight, User } from 'lucide-react';

/*
  REUSABLE WEEKLY SCHEDULE TIMETABLE LAYOUT
  - Live filtering (Day of Week, Difficulty, Keyword text query)
  - Search-first prompt box layout to guide user interaction
  - Class details dropover modal layout (absolute on desktop, inline flow on mobile)
*/
export default function SchedulesLayout({
  schedules = [
    {
      id: 1,
      class_name: "Power Hypertrophy",
      trainer_name: 'Alex "The Titan" Vance',
      day_of_week: "Monday",
      start_time: "08:00 AM",
      duration_minutes: 60,
      room_name: "Room A - Muscle Bay",
      intensity: "Advanced",
      description: "Heavy mechanical tension training targeting chest, back, and arms.",
      trainer_bio: "Alex has helped over 500 clients achieve their dream physiques.",
      trainer_spec: "Bodybuilding",
      trainer_photo: "/images/trainers/alex_vance.jpg"
    }
  ],
  days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  difficulties = ["Beginner", "Intermediate", "Advanced"]
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [activeDropover, setActiveDropover] = useState(null);

  // Filter schedules
  const hasInteraction = searchQuery !== "" || selectedDay !== "" || selectedDifficulty !== "";
  const filtered = schedules.filter(s => {
    const matchesSearch = searchQuery === "" || 
      s.class_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.trainer_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDay = selectedDay === "" || s.day_of_week === selectedDay;
    const matchesDiff = selectedDifficulty === "" || s.intensity === selectedDifficulty;
    return matchesSearch && matchesDay && matchesDiff;
  });

  return (
    <div className="schedule-board">
      
      {/* 1. Filters Row */}
      <div className="filter-rack">
        <div className="search-box-wrapper">
          <Search className="search-icon-inside" size={16} />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search class or trainer..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="dropdowns-row">
          <div className="select-container">
            <select 
              value={selectedDay} 
              onChange={(e) => setSelectedDay(e.target.value)}
              className="custom-select"
            >
              <option value="">Any Day</option>
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="select-container">
            <select 
              value={selectedDifficulty} 
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="custom-select"
            >
              <option value="">Any Difficulty</option>
              {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Main list layout */}
      {!hasInteraction ? (
        <div className="search-prompt-box">
          <Calendar className="prompt-icon" size={48} />
          <h3 className="prompt-title">Find Your Class</h3>
          <p className="prompt-text">
            Specify a day of week, difficulty rating, or keywords above to query active sessions.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-schedule">
          No training sessions align with your selected filter queries.
        </div>
      ) : (
        <div className="schedule-timeline">
          {filtered.map(s => {
            const isDetailActive = activeDropover === s.id;
            
            return (
              <div 
                key={s.id} 
                className={`schedule-card glass-card ${isDetailActive ? 'detail-active' : ''}`}
              >
                {/* Time & Duration Column */}
                <div className="schedule-time-block">
                  <div className="time-val-row">
                    <Clock size={16} className="clock-icon" />
                    <span className="time-val">{s.start_time}</span>
                  </div>
                  <span className="duration-val">{s.duration_minutes} Mins</span>
                </div>

                {/* Class Title & Coach Column */}
                <div className="schedule-info-block">
                  <span className="day-tag-badge">{s.day_of_week}</span>
                  <h4 className="class-title">{s.class_name}</h4>
                  <span className="trainer-name-tag">Coach: <strong>{s.trainer_name}</strong></span>
                </div>

                {/* Location Specs Column */}
                <div className="schedule-meta-block">
                  <div className="meta-row">
                    <Calendar size={14} className="icon-muted" />
                    <span>{s.room_name}</span>
                  </div>
                  <div className="meta-row">
                    <Award size={14} className="icon-muted" />
                    <span className={`intensity-badge intensity-${s.intensity ? s.intensity.toLowerCase() : ''}`}>{s.intensity}</span>
                  </div>
                </div>

                {/* Actions Button */}
                <div className="schedule-action-block">
                  <button 
                    className={`btn-details ${isDetailActive ? 'active' : ''}`}
                    onClick={() => setActiveDropover(isDetailActive ? null : s.id)}
                  >
                    <span>Details</span>
                    <ArrowRight size={14} className={`arrow-icon ${isDetailActive ? 'rotated' : ''}`} />
                  </button>
                </div>

                {/* Reusable dropover overview panel */}
                {isDetailActive && (
                  <div className="schedule-dropover">
                    <div className="class-details-col dropover-section">
                      <h5 className="section-subtitle">Class Guidelines</h5>
                      <p className="class-description">{s.description}</p>
                      
                      <div className="detail-meta-row">
                        <span className="meta-label">Location Room</span>
                        <span className="meta-value">{s.room_name}</span>
                      </div>
                    </div>

                    <div className="trainer-details-col dropover-section">
                      <h5 className="section-subtitle">Your Coach</h5>
                      <div className="trainer-avatar-block">
                        <img src={s.trainer_photo} alt={s.trainer_name} className="dropover-trainer-avatar" />
                        <div className="trainer-avatar-info">
                          <span className="trainer-spec-badge">{s.trainer_spec}</span>
                          <h6 className="trainer-name-heading">{s.trainer_name}</h6>
                        </div>
                      </div>
                      <p className="trainer-quick-bio">{s.trainer_bio}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .schedule-board {
          position: relative;
        }

        .search-prompt-box {
          text-align: center;
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          border: 1px dashed rgba(var(--accent-gold-rgb), 0.3);
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
        }

        .prompt-icon {
          color: var(--accent-gold);
          opacity: 0.8;
        }

        .prompt-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          color: var(--text-primary);
          text-transform: uppercase;
          margin: 0;
        }

        .prompt-text {
          font-size: 0.95rem;
          color: var(--text-secondary);
          max-width: 480px;
          line-height: 1.5;
          margin: 0;
        }

        /* Filters */
        .filter-rack {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 40px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 16px;
          padding: 16px 24px;
        }

        .search-box-wrapper {
          position: relative;
          flex: 1;
        }

        .search-icon-inside {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.6;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 10px;
          padding: 11px 14px 11px 40px;
          font-size: 0.9rem;
          color: var(--text-primary);
          outline: none;
          transition: var(--transition-smooth);
        }

        .search-input:focus {
          border-color: var(--accent-gold);
          box-shadow: 0 0 0 3px rgba(var(--accent-gold-rgb), 0.15);
        }

        .dropdowns-row {
          display: flex;
          gap: 16px;
        }

        .select-container {
          position: relative;
          width: 160px;
        }

        .custom-select {
          width: 100%;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 0.88rem;
          color: var(--text-secondary);
          outline: none;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .custom-select:focus {
          border-color: var(--accent-gold);
          box-shadow: 0 0 0 3px rgba(var(--accent-gold-rgb), 0.15);
        }

        /* Timeline Cards */
        .schedule-timeline {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .schedule-card {
          display: grid;
          grid-template-columns: 0.8fr 1.5fr 1fr 0.7fr;
          align-items: center;
          padding: 20px 30px;
          position: relative;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .schedule-card.detail-active {
          z-index: 10;
          border-color: var(--accent-gold);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
        }

        .schedule-time-block {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .time-val-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .clock-icon {
          color: var(--accent-cyan);
        }

        .time-val {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .duration-val {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .schedule-info-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .day-tag-badge {
          font-size: 0.7rem;
          text-transform: uppercase;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 2px 8px;
          border-radius: 4px;
          width: fit-content;
          letter-spacing: 0.04em;
          font-weight: 600;
        }

        .class-title {
          font-size: 1.25rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-primary);
        }

        .trainer-name-tag {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .schedule-meta-block {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .icon-muted {
          color: var(--text-muted);
        }

        .intensity-badge {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .intensity-beginner {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .intensity-intermediate {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }
        .intensity-advanced {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .btn-details {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: var(--transition-smooth);
          font-family: var(--font-display);
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-details:hover {
          background: var(--bg-secondary);
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        .btn-details.active {
          background: rgba(var(--accent-gold-rgb), 0.08);
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        .arrow-icon {
          transition: transform 0.3s ease;
        }

        .arrow-icon.rotated {
          transform: rotate(180deg);
        }

        /* Dropover popover style rules */
        .schedule-dropover {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          z-index: 100;
          background: #ffffff;
          backdrop-filter: blur(20px);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.06);
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 24px;
          animation: dropoverSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes dropoverSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .class-details-col {
          border-right: 1px solid var(--border-color);
          padding-right: 20px;
        }

        .section-subtitle {
          font-family: var(--font-display);
          font-size: 0.85rem;
          text-transform: uppercase;
          color: var(--accent-gold);
          margin-bottom: 8px;
        }

        .class-description {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .detail-meta-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.85rem;
          margin-top: 12px;
        }

        .meta-label {
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
        }

        .meta-value {
          color: var(--text-primary);
        }

        .trainer-avatar-block {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 12px;
        }

        .dropover-trainer-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--accent-gold);
        }

        .trainer-avatar-info {
          display: flex;
          flex-direction: column;
        }

        .trainer-spec-badge {
          font-size: 0.7rem;
          color: var(--accent-gold);
          text-transform: uppercase;
          font-weight: 700;
        }

        .trainer-name-heading {
          font-family: var(--font-display);
          font-size: 1.05rem;
          color: var(--text-primary);
          margin: 0;
        }

        .trainer-quick-bio {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .empty-schedule {
          text-align: center;
          padding: 40px;
          background: var(--bg-secondary);
          border: 1px dashed var(--border-color);
          border-radius: 12px;
          color: var(--text-secondary);
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .filter-rack {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
            padding: 16px;
          }
          .dropdowns-row {
            width: 100%;
          }
          .select-container {
            flex: 1;
            width: auto;
          }
          .schedule-card {
            grid-template-columns: 1fr;
            gap: 16px;
            padding: 24px;
          }
          .schedule-action-block {
            justify-content: flex-start;
          }
          .schedule-dropover {
            position: relative;
            top: 0;
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 16px;
            margin-top: 12px;
            border-radius: 12px;
          }
          .class-details-col {
            border-right: none;
            padding-right: 0;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 16px;
          }
        }
      `}</style>
    </div>
  );
}
