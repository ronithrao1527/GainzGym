import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Award, Calendar, CheckCircle, Info, ChevronDown } from 'lucide-react';

const CLASS_DETAILS = {
  'Strength Conditioning': {
    description: 'A high-octane workout focused on building functional power, endurance, and muscular density through compound lifts and bodyweight progressions.',
    focus: 'Total Body Strength & Power',
    tips: 'Please arrive 10 minutes early. Bring a towel and stay hydrated.'
  },
  'HIIT Core Blast': {
    description: 'High-Intensity Interval Training combined with deep core stabilization. Burn maximum calories in minimum time while sculpting your abs and obliques.',
    focus: 'Fat Loss & Cardiovascular Endurance',
    tips: 'Suitable for all fitness levels. Modifications will be provided.'
  },
  'Vinyasa Flow Yoga': {
    description: 'Synchronize breath with movement in this dynamic flow. Build mobility, core strength, and mindfulness to help you recover and decompress.',
    focus: 'Flexibility, Balance & Mental Clarity',
    tips: 'Yoga mats are provided. Wear comfortable, stretchable clothing.'
  },
  'Powerlifting Fundamentals': {
    description: 'Master the big three lifts: Squat, Bench Press, and Deadlift. Learn proper mechanics, bracing, and bar paths to lift heavy and injury-free.',
    focus: 'Squat, Bench, Deadlift Technique',
    tips: 'Flat-sole shoes recommended. Belts and chalk are available.'
  },
  'Cardio Kickboxing': {
    description: 'An explosive cardio session incorporating kickboxing combinations, bag work, and agility drills to boost coordination and incinerate calories.',
    focus: 'Agility, Stamina & Stress Relief',
    tips: 'Hand wraps and gloves are available for rent at the front desk.'
  },
  'Flexibility & Mobility': {
    description: 'Release tight joints and improve range of motion. Targets hips, shoulders, and spine to correct posture and prevent training injuries.',
    focus: 'Active Joint Range of Motion & Recovery',
    tips: 'Excellent session to pair with heavy strength training days.'
  },
  'Olympic Weightlifting': {
    description: 'Advanced technical instruction on the Clean & Jerk and Snatch. Develop explosive speed, triple extension, and overhead stability.',
    focus: 'Explosiveness & Overhead Mechanics',
    tips: 'Advanced class. Previous lifting experience is recommended.'
  },
  'Yin Yoga & Meditate': {
    description: 'A slow-paced style of yoga with postures held for longer periods. Targets deep connective tissues, promoting relaxation and stress reduction.',
    focus: 'Deep Stretch, Recovery & Meditation',
    tips: 'Warm layers recommended as body temperature drops during stillness.'
  },
  'Yin Yoga & Meditation': {
    description: 'A slow-paced style of yoga with postures held for longer periods. Targets deep connective tissues, promoting relaxation and stress reduction.',
    focus: 'Deep Stretch, Recovery & Meditation',
    tips: 'Warm layers recommended as body temperature drops during stillness.'
  },
  'Sunset Flow Yoga': {
    description: 'Unwind your week with a gentle, sunset yoga flow. Reconnect with your body, lengthen tight muscles, and transition into a peaceful weekend.',
    focus: 'Stress Relief & Active Recovery',
    tips: 'A perfect end-of-week active recovery class.'
  },
  'Weekend Warrior Bootcamp': {
    description: 'A challenging team-based circuit workout using kettlebells, battle ropes, and sleds. Push your limits and start your weekend strong.',
    focus: 'Conditioning, Power & Teamwork',
    tips: 'High-intensity class. Bring extra water and your warrior mindset.'
  },
  'Powerlifting Meet Prep': {
    description: 'Elite strength training tailored for lifters preparing for competition. Focuses on peaking phases, singles, commands, and attempts selection.',
    focus: 'Competition Peaking & Maximum Load',
    tips: 'Coach approval required. Wear competition-compliant gear.'
  }
};

export default function ScheduleBoard() {
  const [scheduleData, setScheduleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [activeDetailId, setActiveDetailId] = useState(null);
  const [selectedDay, setSelectedDay] = useState('All');
  const [selectedIntensity, setSelectedIntensity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dayDropdownOpen, setDayDropdownOpen] = useState(false);
  const [intensityDropdownOpen, setIntensityDropdownOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null); // { classId, success }
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const host = window.location.hostname === 'localhost' ? 'http://localhost:5001' : '';
      
      // Fetch schedules
      const response = await fetch(`${host}/api/schedules`);
      if (response.ok) {
        const data = await response.json();
        setScheduleData(data);
        setFilteredData(data);
      }

      // Fetch trainers
      const trainersResponse = await fetch(`${host}/api/trainers`);
      if (trainersResponse.ok) {
        const data = await trainersResponse.json();
        setTrainers(data);
      }
    } catch (err) {
      console.error('Failed to fetch timetable data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch schedules & trainers on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Listen for schedule modifications in Admin Command Panel
  useEffect(() => {
    const handleScheduleChanged = () => {
      fetchData();
    };
    window.addEventListener('schedule-changed', handleScheduleChanged);
    return () => {
      window.removeEventListener('schedule-changed', handleScheduleChanged);
    };
  }, []);

  // Click outside listener to close dropdowns
  useEffect(() => {
    const handleDocumentClick = () => {
      setDayDropdownOpen(false);
      setIntensityDropdownOpen(false);
    };
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  // Filter schedules by day, intensity level, and search keyword
  useEffect(() => {
    let result = scheduleData;
    
    if (selectedDay !== 'All') {
      result = result.filter(item => item.day_of_week === selectedDay);
    }
    
    if (selectedIntensity !== 'All') {
      result = result.filter(item => item.intensity === selectedIntensity);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.class_name.toLowerCase().includes(query) ||
        (item.trainer_name && item.trainer_name.toLowerCase().includes(query)) ||
        item.room.toLowerCase().includes(query)
      );
    }
    
    setFilteredData(result);
  }, [selectedDay, selectedIntensity, searchQuery, scheduleData]);

  // Format Time string "07:00:00" -> "7:00 AM"
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    const host = window.location.hostname === 'localhost' ? 'http://localhost:5001' : '';
    return path.startsWith('http') ? path : `${host}${path}`;
  };

  // Handle mock booking reservation
  const handleBookClass = (classItem) => {
    setBookingStatus({ id: classItem.id, name: classItem.class_name });
    setTimeout(() => {
      setBookingStatus(null);
    }, 4000);
  };

  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const intensities = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const getIntensityClass = (intensity) => {
    switch (intensity.toLowerCase()) {
      case 'beginner': return 'intensity-beginner';
      case 'intermediate': return 'intensity-intermediate';
      case 'advanced': return 'intensity-advanced';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="schedule-loading">
        <div className="spinner"></div>
        <p>Loading Gainz Timetable...</p>
      </div>
    );
  }

  const hasSearched = selectedDay !== 'All' || selectedIntensity !== 'All' || searchQuery.trim() !== '';

  return (
    <div className="schedule-board">
      
      {/* Dynamic Booking Alert Toast */}
      {bookingStatus && (
        <div className="booking-toast">
          <CheckCircle size={20} className="toast-icon" />
          <span>Spot reserved for <strong>{bookingStatus.name}</strong>! Check your email.</span>
        </div>
      )}

      {/* Compact Search & Filter Rack */}
      <div className="filter-rack">
        
        {/* Search Input Box */}
        <div className="search-box-wrapper">
          <span className="search-icon-inside">🔍</span>
          <input 
            type="text" 
            placeholder="Search classes, coaches, or rooms..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search-btn" 
              onClick={() => setSearchQuery('')}
              aria-label="Clear search query"
            >
              &times;
            </button>
          )}
        </div>

        {/* Dropdowns selectors row */}
        <div className="dropdowns-row">
          
          {/* Day of Week Selector */}
          <div className="custom-dropdown-container">
            <span className="dropdown-label-mini">Day of Week</span>
            <button 
              className={`dropdown-toggle-btn ${dayDropdownOpen ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setDayDropdownOpen(!dayDropdownOpen);
                setIntensityDropdownOpen(false);
              }}
              aria-label="Filter by day"
            >
              <span>{selectedDay === 'All' ? 'Full Week' : selectedDay}</span>
              <ChevronDown size={14} className={`chevron-indicator ${dayDropdownOpen ? 'rotated' : ''}`} />
            </button>
            
            {dayDropdownOpen && (
              <div className="dropdown-menu-list" onClick={(e) => e.stopPropagation()}>
                {days.map(day => (
                  <button
                    key={day}
                    className={`dropdown-menu-item ${selectedDay === day ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedDay(day);
                      setDayDropdownOpen(false);
                    }}
                  >
                    {day === 'All' ? 'Full Week' : day}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Difficulty / Intensity Selector */}
          <div className="custom-dropdown-container">
            <span className="dropdown-label-mini">Difficulty</span>
            <button 
              className={`dropdown-toggle-btn ${intensityDropdownOpen ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setIntensityDropdownOpen(!intensityDropdownOpen);
                setDayDropdownOpen(false);
              }}
              aria-label="Filter by difficulty"
            >
              <span>{selectedIntensity === 'All' ? 'All Intensities' : selectedIntensity}</span>
              <ChevronDown size={14} className={`chevron-indicator ${intensityDropdownOpen ? 'rotated' : ''}`} />
            </button>
            
            {intensityDropdownOpen && (
              <div className="dropdown-menu-list" onClick={(e) => e.stopPropagation()}>
                {intensities.map(intensity => (
                  <button
                    key={intensity}
                    className={`dropdown-menu-item ${selectedIntensity === intensity ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedIntensity(intensity);
                      setIntensityDropdownOpen(false);
                    }}
                  >
                    {intensity === 'All' ? 'All Intensities' : intensity}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Timeline Grid */}
      {!hasSearched ? (
        <div className="search-prompt-box glass-card">
          <Calendar size={44} className="prompt-icon" />
          <h3 className="prompt-title">Find Your Class</h3>
          <p className="prompt-text">Select a day of the week, a difficulty level, or search by class name to display scheduled training sessions.</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="empty-schedule">
          <p>No classes scheduled for the selected filters.</p>
        </div>
      ) : (
        <div className="schedule-timeline">
          {filteredData.map((item) => {
            const classExtra = CLASS_DETAILS[item.class_name] || {
              description: 'Join our professional class to reach your peak fitness and performance goals.',
              focus: 'General Conditioning & Fitness',
              tips: 'Bring water and arrive 5-10 minutes early.'
            };

            const coach = trainers.find(t => t.id === item.trainer_id) || {
              name: item.trainer_name || 'Staff Coach',
              specialization: 'Fitness & Conditioning',
              bio: 'Our certified coach will guide you through proper techniques and keep you motivated.',
              photo_url: '/images/trainers/alex_vance.jpg'
            };

            return (
              <div 
                key={item.id} 
                className={`schedule-card glass-card ${activeDetailId === item.id ? 'detail-active' : ''}`}
                onMouseEnter={() => setActiveDetailId(item.id)}
                onMouseLeave={() => setActiveDetailId(null)}
              >
                
                <div className="schedule-time-block">
                  <Clock size={16} className="clock-icon" />
                  <span className="time-val">{formatTime(item.start_time)}</span>
                  <span className="duration-val">({item.duration_minutes} Mins)</span>
                </div>

                <div className="schedule-info-block">
                  <div className="day-tag-badge">{item.day_of_week}</div>
                  <h3 className="class-title">{item.class_name}</h3>
                  <span className="trainer-name-tag">Coach: <strong>{item.trainer_name || 'Staff'}</strong></span>
                </div>

                <div className="schedule-meta-block">
                  <div className="meta-row">
                    <MapPin size={14} className="icon-muted" />
                    <span>{item.room}</span>
                  </div>
                  <div className={`intensity-badge ${getIntensityClass(item.intensity)}`}>
                    {item.intensity}
                  </div>
                </div>

                <div className="schedule-action-block">
                  <button 
                    className={`btn-details ${activeDetailId === item.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDetailId(activeDetailId === item.id ? null : item.id);
                    }}
                    aria-label="Toggle class details"
                  >
                    <Info size={13} />
                    <span>Details</span>
                    <ChevronDown size={13} className={`arrow-icon ${activeDetailId === item.id ? 'rotated' : ''}`} />
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookClass(item);
                    }}
                  >
                    Book Slot
                  </button>
                </div>

                {/* Dropover detail section */}
                {activeDetailId === item.id && (
                  <div className="schedule-dropover">
                    <div className="dropover-section class-details-col">
                      <h4 className="section-subtitle">Class Overview</h4>
                      <p className="class-description">{classExtra.description}</p>
                      
                      <div className="detail-meta-row">
                        <span className="meta-label">Focus Area</span>
                        <span className="meta-value">{classExtra.focus}</span>
                      </div>
                      
                      <div className="detail-meta-row">
                        <span className="meta-label">Preparation & Tips</span>
                        <span className="meta-value">{classExtra.tips}</span>
                      </div>
                    </div>
                    
                    <div className="dropover-section trainer-details-col">
                      <h4 className="section-subtitle">Instructor Profile</h4>
                      <div className="trainer-avatar-block">
                        <img 
                          src={getImageUrl(coach.photo_url)} 
                          alt={coach.name} 
                          className="dropover-trainer-avatar"
                          onError={(e) => {
                            e.target.src = getImageUrl('/images/trainers/alex_vance.jpg');
                          }}
                        />
                        <div className="trainer-avatar-info">
                          <span className="trainer-spec-badge">{coach.specialization}</span>
                          <h5 className="trainer-name-heading">{coach.name}</h5>
                          <span className="trainer-exp-label">{coach.experience_years ? `${coach.experience_years}+ Years Experience` : 'Gainz Elite Staff'}</span>
                        </div>
                      </div>
                      <p className="trainer-quick-bio">{coach.bio}</p>
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

        /* Loading */
        .schedule-loading {
          text-align: center;
          padding: 60px 0;
        }
        .spinner {
          border: 4px solid rgba(var(--accent-cyan-rgb), 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: var(--accent-cyan);
          animation: spin 1s linear infinite;
          margin: 0 auto 16px auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Search Prompt Box */
        .search-prompt-box {
          text-align: center;
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          border: 1px dashed rgba(229, 192, 96, 0.2);
          background: rgba(255, 255, 255, 0.01);
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .prompt-icon {
          color: var(--accent-gold);
          opacity: 0.8;
          animation: floatPrompt 3s ease-in-out infinite;
        }

        @keyframes floatPrompt {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .prompt-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin: 0;
        }

        .prompt-text {
          font-size: 0.95rem;
          color: var(--text-secondary);
          max-width: 480px;
          line-height: 1.5;
          margin: 0;
        }

        /* Toast Alert */
        .booking-toast {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: #10b981;
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
          z-index: 999;
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .toast-icon {
          animation: pulse 1.5s infinite;
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        /* Filters */
        .filter-rack {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 40px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 16px 24px;
        }

        .search-box-wrapper {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .search-icon-inside {
          position: absolute;
          left: 14px;
          font-size: 0.95rem;
          opacity: 0.6;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 11px 14px 11px 40px;
          font-size: 0.9rem;
          color: var(--text-primary);
          outline: none;
          transition: var(--transition-smooth);
        }

        .search-input:focus {
          border-color: var(--accent-gold);
          box-shadow: 0 0 10px rgba(229, 192, 96, 0.1);
          background: rgba(255, 255, 255, 0.04);
        }

        .clear-search-btn {
          position: absolute;
          right: 12px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.2rem;
          cursor: pointer;
        }

        .clear-search-btn:hover {
          color: var(--text-primary);
        }

        .dropdowns-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .custom-dropdown-container {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 180px;
        }

        .dropdown-label-mini {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          font-weight: 700;
        }

        .dropdown-toggle-btn {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 0.88rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: var(--transition-smooth);
          outline: none;
          width: 100%;
        }

        .dropdown-toggle-btn:hover {
          border-color: rgba(229, 192, 96, 0.35);
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.04);
        }

        .dropdown-toggle-btn.active {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
          background: rgba(229, 192, 96, 0.05);
          box-shadow: 0 0 10px rgba(229, 192, 96, 0.1);
        }

        .chevron-indicator {
          transition: transform 0.3s ease;
        }

        .chevron-indicator.rotated {
          transform: rotate(180deg);
        }

        .dropdown-menu-list {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          z-index: 150;
          background: rgba(11, 12, 16, 0.98);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(229, 192, 96, 0.2);
          border-radius: 10px;
          padding: 6px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          gap: 2px;
          max-height: 240px;
          overflow-y: auto;
          animation: dropMenuIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes dropMenuIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-menu-item {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          text-align: left;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .dropdown-menu-item:hover {
          background: rgba(229, 192, 96, 0.1);
          color: var(--accent-gold);
        }

        .dropdown-menu-item.selected {
          background: rgba(229, 192, 96, 0.15);
          color: var(--accent-gold);
          font-weight: 600;
        }

        /* Timeline / Cards */
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
          border-color: rgba(229, 192, 96, 0.35);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(229, 192, 96, 0.05);
        }

        .schedule-time-block {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .clock-icon {
          color: var(--accent-cyan);
          margin-bottom: 2px;
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
          background: rgba(255, 255, 255, 0.05);
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

        .trainer-name-tag strong {
          color: var(--text-primary);
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
          width: fit-content;
          letter-spacing: 0.04em;
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

        .schedule-action-block {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          align-items: center;
        }

        .btn-details {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.12);
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
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(229, 192, 96, 0.35);
          color: var(--accent-gold);
        }

        .btn-details.active {
          background: rgba(229, 192, 96, 0.1);
          border-color: var(--accent-gold);
          color: var(--accent-gold);
          box-shadow: 0 0 12px rgba(229, 192, 96, 0.1);
        }

        .arrow-icon {
          transition: transform 0.3s ease;
        }

        .arrow-icon.rotated {
          transform: rotate(180deg);
        }

        .btn-sm {
          padding: 8px 16px;
          font-size: 0.8rem;
        }

        /* Dropover Popover Layout */
        .schedule-dropover {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(11, 12, 16, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(229, 192, 96, 0.22);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 20px rgba(229, 192, 96, 0.05);
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 24px;
          animation: dropoverSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: auto;
          text-align: left;
        }

        @keyframes dropoverSlideIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropover-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .class-details-col {
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          padding-right: 20px;
        }

        .section-subtitle {
          font-family: var(--font-display);
          font-size: 0.85rem;
          text-transform: uppercase;
          color: var(--accent-gold);
          letter-spacing: 0.06em;
          margin: 0;
        }

        .class-description {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .detail-meta-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.85rem;
        }

        .meta-label {
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .meta-value {
          color: var(--text-primary);
        }

        .trainer-avatar-block {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .dropover-trainer-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--accent-gold);
          box-shadow: 0 0 10px rgba(229, 192, 96, 0.15);
        }

        .trainer-avatar-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .trainer-spec-badge {
          font-size: 0.7rem;
          color: var(--accent-gold);
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .trainer-name-heading {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .trainer-exp-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .trainer-quick-bio {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.45;
          margin: 0;
        }

        .empty-schedule {
          text-align: center;
          padding: 40px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          color: var(--text-secondary);
        }

        /* Responsive */
        @media (max-width: 900px) {
          .filter-rack {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
            padding: 16px;
          }
          .search-box-wrapper {
            max-width: none;
            width: 100%;
          }
          .dropdowns-row {
            flex-direction: row;
            gap: 12px;
            width: 100%;
          }
          .custom-dropdown-container {
            flex: 1;
            width: auto;
          }
          .schedule-card {
            grid-template-columns: 1fr;
            gap: 16px;
            padding: 24px;
          }
          .schedule-card.detail-active {
            border-color: rgba(229, 192, 96, 0.2);
            box-shadow: none;
          }
          .schedule-action-block {
            justify-content: flex-start;
            margin-top: 8px;
            gap: 10px;
            width: 100%;
          }
          .btn-details, .schedule-action-block .btn-sm {
            flex: 1;
            width: auto;
            justify-content: center;
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
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding-bottom: 16px;
          }
        }
      `}</style>
    </div>
  );
}
