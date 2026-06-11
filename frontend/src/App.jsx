import React, { useState, useEffect } from 'react';
import { Dumbbell, Users, Calendar, Award, Phone, Image as ImageIcon, MapPin, ChevronRight, Activity, ArrowUpRight, Shield, LogOut } from 'lucide-react';
import ScheduleBoard from './components/ScheduleBoard';
import Equipment360Viewer from './components/Equipment360Viewer';
import InquiryForm from './components/InquiryForm';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';

// 1. Local Fallback Datasets in INR (₹)
const MOCK_PLANS = [
  {
    id: 1,
    name: 'Basic Access',
    price: 2499,
    period: 'month',
    features: ["Gym floor access", "Locker room & showers", "1 Fitness assessment", "Standard hours (6 AM - 10 PM)"],
    badge: null
  },
  {
    id: 2,
    name: 'Gainz VIP',
    price: 4999,
    period: 'month',
    features: ["24/7 Unlimited Access", "All Group Fitness Classes", "2 Personal training sessions/mo", "Sauna & recovery lounge", "Free customized meal plan", "10% Gym shop discount"],
    badge: 'Popular'
  },
  {
    id: 3,
    name: 'Elite Warrior',
    price: 12499,
    period: 'month',
    features: ["Everything in Gainz VIP", "Unlimited Personal Training", "Daily recovery therapy (Cryo/Compression)", "Monthly body scan & biometric analysis", "Custom workout programming app", "Complementary protein shake daily"],
    badge: 'Best Value'
  }
];

const MOCK_TRAINERS = [
  {
    id: 1,
    name: 'Alex "The Titan" Vance',
    specialization: 'Bodybuilding & Hypertrophy',
    experience_years: 10,
    bio: 'Alex has helped over 500 clients achieve their dream physiques. He specializes in mechanical tension training and progressive overload strategies.',
    photo_url: '/images/trainers/alex_vance.jpg'
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    specialization: 'HIIT & Athletic Conditioning',
    experience_years: 6,
    bio: 'A former track athlete, Sarah brings high energy and science-backed interval training to build endurance and explosive power.',
    photo_url: '/images/trainers/sarah_jenkins.jpg'
  },
  {
    id: 3,
    name: 'Marcus Thorne',
    specialization: 'Powerlifting & Strength',
    experience_years: 8,
    bio: 'Marcus focuses on compound lifts (squat, bench, deadlift) and corrective movement patterns to build raw, functional strength safely.',
    photo_url: '/images/trainers/marcus_thorne.jpg'
  },
  {
    id: 4,
    name: 'Elena Rostova',
    specialization: 'Yoga, Mobility & Flexibility',
    experience_years: 7,
    bio: 'Elena combines Vinyasa flow with modern active mobility drills to help athletes recover faster and move pain-free.',
    photo_url: '/images/trainers/elena_rostova.jpg'
  }
];

const MOCK_EQUIPMENT = [
  {
    id: 1,
    name: 'Gainz Functional Trainer',
    category: 'Strength',
    muscle_groups: 'Chest, Back, Arms, Core',
    description: 'The ultimate multi-station cable machine. Offers dual independent weight stacks and adjustable pulley positions, enabling hundreds of functional movement paths for strength, stability, and rehabilitation.',
    features: ["Dual 95kg/210lbs weight stacks", "18 adjustable vertical positions", "Premium magnetic selector pins", "Integrated multi-grip pull-up bar"],
    specs: {"Dimensions": "165 x 100 x 212 cm", "Total Weight": "370 kg", "Material": "Heavy-duty 11-gauge steel", "Pulley Ratio": "2:1"},
    photo_url: '/images/equipment/functional_trainer_front.jpg',
    rotation_photos: ["/images/equipment/functional_trainer_0.jpg", "/images/equipment/functional_trainer_90.jpg", "/images/equipment/functional_trainer_180.jpg", "/images/equipment/functional_trainer_270.jpg"]
  },
  {
    id: 2,
    name: 'Apex Horizon Treadmill',
    category: 'Cardio',
    muscle_groups: 'Legs, Cardiovascular System',
    description: 'Engineered for elite endurance training. Features a commercial-grade 4.5 HP motor, orthopedic cushioning belt, and a high-definition console simulating scenic routes. Smooth, quiet, and built to withstand intensive running.',
    features: ["4.5 HP continuous-duty motor", "0-20% motorized incline range", "Orthopedic shock absorption belt", "Integrated cooling fans & speakers"],
    specs: {"Dimensions": "215 x 92 x 150 cm", "Max User Weight": "180 kg", "Speed Range": "0.8 - 22 km/h", "Console Screen": "15.6 inch HD Touchscreen"},
    photo_url: '/images/equipment/treadmill_front.jpg',
    rotation_photos: ["/images/equipment/treadmill_0.jpg", "/images/equipment/treadmill_90.jpg", "/images/equipment/treadmill_180.jpg", "/images/equipment/treadmill_270.jpg"]
  },
  {
    id: 3,
    name: 'Heavy-Duty Power Cage',
    category: 'Strength / Free Weights',
    muscle_groups: 'Quadriceps, Hamstrings, Glutes, Back',
    description: 'A bulletproof rack designed for heavy squats, bench presses, and overhead movements. Features integrated multi-angle pull-up bars, spotter arms, and plate storage horns. Built to hold massive loads with zero wobble.',
    features: ["Laser-cut upright numbering", "3x3 inch structural steel tubing", "Magnetic locking J-Cups", "Multi-grip pull-up system"],
    specs: {"Dimensions": "145 x 168 x 230 cm", "Weight Capacity": "680 kg / 1500 lbs", "Hole Spacing": "Westside spacing (2\" on centers)", "Finish": "Matte black powder coat"},
    photo_url: '/images/equipment/power_cage_front.jpg',
    rotation_photos: ["/images/equipment/power_cage_0.jpg", "/images/equipment/power_cage_90.jpg", "/images/equipment/power_cage_180.jpg", "/images/equipment/power_cage_270.jpg"]
  },
  {
    id: 4,
    name: 'Gainz Iso-Lateral Leg Press',
    category: 'Strength',
    muscle_groups: 'Quadriceps, Glutes, Hamstrings',
    description: 'Target the lower body with perfect bio-mechanical alignment. The iso-lateral movement allows unilateral training, rectifying muscle imbalances. Linear bearings provide a silky smooth sled action under maximum load.',
    features: ["Unilateral or bilateral leg pressing", "Dual weight horns (fits Olympic plates)", "Adjustable seat angle with lumbar support", "Safety release lock handles"],
    specs: {"Dimensions": "220 x 150 x 148 cm", "Max Load Capacity": "500 kg / 1100 lbs", "Sled Angle": "45 degrees", "Bearing Type": "Industrial linear ball bearings"},
    photo_url: '/images/equipment/leg_press_front.jpg',
    rotation_photos: ["/images/equipment/leg_press_0.jpg", "/images/equipment/leg_press_90.jpg", "/images/equipment/leg_press_180.jpg", "/images/equipment/leg_press_270.jpg"]
  }
];

export default function App() {
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [equipment, setEquipment] = useState([]);
  
  // Modals/Dashboard Toggles
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [prefilledSubject, setPrefilledSubject] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  
  // Auth state
  const [isAdmin, setIsAdmin] = useState(false);

  // Check auth session on load
  useEffect(() => {
    const token = localStorage.getItem('gainz_admin_token');
    if (token === 'gainz-session-token-admin') {
      setIsAdmin(true);
    }
  }, []);

  // Fetch plans, trainers, equipment
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const host = window.location.hostname === 'localhost' ? 'http://localhost:5001' : '';
        const res = await fetch(`${host}/api/plans`);
        if (res.ok) {
          setPlans(await res.json());
        } else {
          setPlans(MOCK_PLANS);
        }
      } catch (err) {
        console.warn('API connection failed. Falling back to local membership plans.');
        setPlans(MOCK_PLANS);
      }
    };

    const fetchTrainers = async () => {
      try {
        const host = window.location.hostname === 'localhost' ? 'http://localhost:5001' : '';
        const res = await fetch(`${host}/api/trainers`);
        if (res.ok) {
          setTrainers(await res.json());
        } else {
          setTrainers(MOCK_TRAINERS);
        }
      } catch (err) {
        console.warn('API connection failed. Falling back to local trainer profiles.');
        setTrainers(MOCK_TRAINERS);
      }
    };

    const fetchEquipment = async () => {
      try {
        const host = window.location.hostname === 'localhost' ? 'http://localhost:5001' : '';
        const res = await fetch(`${host}/api/equipment`);
        if (res.ok) {
          setEquipment(await res.json());
        } else {
          setEquipment(MOCK_EQUIPMENT);
        }
      } catch (err) {
        console.warn('API connection failed. Falling back to local equipment catalog.');
        setEquipment(MOCK_EQUIPMENT);
      }
    };

    fetchPlans();
    fetchTrainers();
    fetchEquipment();
  }, []);

  // Login Handlers
  const handleLoginSuccess = (token, user) => {
    localStorage.setItem('gainz_admin_token', token);
    setIsAdmin(true);
    setShowAdminDashboard(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('gainz_admin_token');
    setIsAdmin(false);
    setShowAdminDashboard(false);
  };

  // Dashboard Reactive updates
  const handlePlanUpdated = (planId, newPrice) => {
    setPlans(prev => prev.map(p => p.id === Number(planId) ? { ...p, price: newPrice } : p));
  };

  const handleTrainerAdded = (newTrainer) => {
    setTrainers(prev => [...prev, newTrainer]);
  };

  const handleEquipmentAdded = (newEq) => {
    setEquipment(prev => [newEq, ...prev]);
  };

  const handleInquireForEquipment = (eqName) => {
    setPrefilledSubject(eqName);
  };

  const getImageUrl = (path) => path;

  return (
    <div className="titan-gym-app">
      
      {/* 1. Header & Navigation */}
      <header className="main-header">
        <div className="header-container">
          <a href="#" className="logo-area">
            <Dumbbell className="logo-icon" />
            <span className="logo-text">GAINZ<span>GYM</span></span>
          </a>
          
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`nav-bar ${mobileMenuOpen ? 'open' : ''}`}>
            <a href="#hero-section" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#plans-section" onClick={() => setMobileMenuOpen(false)}>Memberships</a>
            <a href="#trainers-section" onClick={() => setMobileMenuOpen(false)}>Trainers</a>
            <a href="#schedule-section" onClick={() => setMobileMenuOpen(false)}>Schedules</a>
            <a href="#equipment-section" onClick={() => setMobileMenuOpen(false)}>Equipment</a>
            <a href="#gallery-section" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            
            {isAdmin ? (
              <>
                <button className="nav-admin-btn" onClick={() => setShowAdminDashboard(true)}>
                  <Shield size={14} /> Admin Panel
                </button>
                <button className="nav-logout-btn" onClick={handleLogout} aria-label="Sign out">
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <button className="nav-portal-btn" onClick={() => setShowLoginModal(true)}>
                Admin Login
              </button>
            )}
            
            <a href="#contact-section" className="nav-contact-btn" onClick={() => setMobileMenuOpen(false)}>Contact Us</a>
          </nav>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section id="hero-section" className="hero-banner">
        <div className="hero-bg-overlay"></div>
        <div className="container hero-content-wrapper">
          <div className="hero-meta">
            <Activity className="hero-meta-icon" size={16} />
            <span>THE GAINZ TEMPLE</span>
          </div>
          <h1 className="hero-title">
            MAXIMIZE YOUR<br />
            <span>GAINZ</span>
          </h1>
          <p className="hero-desc">
            Equipped with state-of-the-art machinery, world-class trainers, and an inspiring high-tech atmosphere, Gainz Gym is built to push your limits and maximize strength.
          </p>
          <div className="hero-ctas">
            <a href="#plans-section" className="btn btn-primary">Choose Your Plan <ChevronRight size={16} /></a>
            <a href="#equipment-section" className="btn btn-secondary">Explore Equipment</a>
          </div>
        </div>

        {/* Hero quick highlights bar */}
        <div className="hero-highlights-bar">
          <div className="container highlights-grid">
            <div className="highlight-item">
              <h3>24/7</h3>
              <span>Arena Access</span>
            </div>
            <div className="highlight-item">
              <h3>15+</h3>
              <span>Elite Instructors</span>
            </div>
            <div className="highlight-item">
              <h3>30+</h3>
              <span>Weekly Sessions</span>
            </div>
            <div className="highlight-item">
              <h3>100%</h3>
              <span>Gainz Driven</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Membership Plans Section */}
      <section id="plans-section" className="section bg-secondary">
        <div className="container">
          <div className="text-center">
            <span className="badge-neon cyan">PRICING TIERS</span>
            <h2 className="section-title">CHOOSE YOUR <span>BATTLEPLAN</span></h2>
            <p className="section-subtitle">
              Flexible membership options engineered for diverse schedules and fitness objectives. All rates listed in INR (₹).
            </p>
          </div>

          <div className="plans-grid">
            {plans.map((plan) => {
              const nameLower = plan.name.toLowerCase();
              const planClass = nameLower.includes('basic') ? 'plan-basic' : 
                                nameLower.includes('vip') ? 'plan-vip' : 
                                nameLower.includes('elite') ? 'plan-elite' : '';
              return (
                <div 
                  key={plan.id} 
                  className={`plan-card glass-card ${planClass} ${plan.badge ? 'highlighted-plan' : ''}`}
                >
                  {plan.badge && <div className="plan-popular-badge">{plan.badge}</div>}
                  
                  <h3 className="plan-name">{plan.name}</h3>
                  
                  <div className="plan-price-block">
                    <span className="price-symbol">₹</span>
                    <span className="price-value">{plan.price.toLocaleString('en-IN')}</span>
                    <span className="price-period">/ {plan.period}</span>
                  </div>

                  <ul className="plan-features">
                    {plan.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>

                  <a 
                    href="#contact-section" 
                    className={`btn plan-btn ${
                      nameLower.includes('vip') ? 'btn-vip' : 
                      nameLower.includes('elite') ? 'btn-elite' : 'btn-secondary'
                    }`}
                    onClick={() => setPrefilledSubject(`Membership: ${plan.name}`)}
                  >
                    Acquire Access
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Trainers Section */}
      <section id="trainers-section" className="section bg-primary">
        <div className="container">
          <div className="text-center">
            <span className="badge-neon lime">ELITE COMMANDERS</span>
            <h2 className="section-title">MEET OUR <span>ELITE COACHES</span></h2>
            <p className="section-subtitle">
              Learn from bodybuilding champions, endurance track stars, and corrective movement therapists.
            </p>
          </div>

          <div className="trainers-grid">
            {trainers.map((trainer) => (
              <div key={trainer.id} className="trainer-profile-card glass-card">
                <div className="trainer-photo-wrapper">
                  <img 
                    src={getImageUrl(trainer.photo_url)} 
                    alt={trainer.name} 
                    className="trainer-portrait" 
                  />
                  <div className="trainer-exp-badge">
                    <span>{trainer.experience_years}+ Yrs Exp</span>
                  </div>
                </div>
                <div className="trainer-content">
                  <span className="trainer-spec">{trainer.specialization}</span>
                  <h3 className="trainer-name">{trainer.name}</h3>
                  <p className="trainer-bio">{trainer.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Class Schedules Section */}
      <section id="schedule-section" className="section bg-secondary">
        <div className="container">
          <div className="text-center">
            <span className="badge-neon cyan">TIMETABLE</span>
            <h2 className="section-title">WEEKLY <span>ARENA SCHEDULE</span></h2>
            <p className="section-subtitle">
              Filter classes by days or physical disciplines and reserve your slot instantly.
            </p>
          </div>

          <ScheduleBoard />
        </div>
      </section>

      {/* 6. Equipment Catalog Section */}
      <section id="equipment-section" className="section bg-primary">
        <div className="container">
          <div className="text-center">
            <span className="badge-neon lime">THE GEAR</span>
            <h2 className="section-title">EQUIPMENT <span>ARMORY</span></h2>
            <p className="section-subtitle">
              Explore our bi-mechanically optimized heavy machinery. Click any machine to view in **360-degree interactive 3D**.
            </p>
          </div>

          <div className="equipment-catalog-grid">
            {equipment.map((item) => (
              <div 
                key={item.id} 
                className="equipment-catalog-card glass-card"
                onClick={() => setSelectedEquipment(item)}
              >
                <div className="eq-card-image-box">
                  <img 
                    src={getImageUrl(item.photo_url)} 
                    alt={item.name} 
                    className="eq-card-photo" 
                  />
                  <div className="eq-360-hover-overlay">
                    <span className="scan-indicator-hud">
                      <ChevronRight size={18} /> CLICK TO ROTATE 360°
                    </span>
                  </div>
                </div>
                <div className="eq-card-info">
                  <div className="eq-card-meta">
                    <span className="eq-cat">{item.category}</span>
                    <span className="eq-target">{item.muscle_groups}</span>
                  </div>
                  <h3 className="eq-card-title">{item.name} <ArrowUpRight size={16} className="arrow-icon" /></h3>
                  <p className="eq-card-summary">
                    {item.description.substring(0, 85)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Gallery Section */}
      <section id="gallery-section" className="section bg-secondary">
        <div className="container">
          <div className="text-center">
            <span className="badge-neon cyan">THE GALLERY</span>
            <h2 className="section-title">INSIDE THE <span>GAINZ DOMAIN</span></h2>
            <p className="section-subtitle">
              A visual walk through our strength lines, recovery zones, and cardio bays.
            </p>
          </div>

          <div className="gallery-masonry">
            <div className="gallery-brick large">
              <img src={getImageUrl('/images/gym_hero_bg.png')} alt="Gym interior wide" />
              <div className="brick-overlay"><h4>MAIN STRENGTH FLOOR</h4></div>
            </div>
            <div className="gallery-brick">
              <img src={getImageUrl('/images/equipment/power_cage_front.jpg')} alt="Squat rack detail" />
              <div className="brick-overlay"><h4>FREE WEIGHT CAGES</h4></div>
            </div>
            <div className="gallery-brick">
              <img src={getImageUrl('/images/equipment/treadmill_front.jpg')} alt="Treadmills" />
              <div className="brick-overlay"><h4>CARDIO DECK</h4></div>
            </div>
            <div className="gallery-brick tall">
              <img src={getImageUrl('/images/trainers/alex_vance.jpg')} alt="Coaching session" />
              <div className="brick-overlay"><h4>PERSONAL TRAINING</h4></div>
            </div>
            <div className="gallery-brick">
              <img src={getImageUrl('/images/equipment/leg_press_front.jpg')} alt="Leg press setup" />
              <div className="brick-overlay"><h4>ISOLATION MACHINES</h4></div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Inquiry Form Section */}
      <section id="inquiry-section" className="section bg-primary">
        <div className="container">
          <div className="text-center">
            <span className="badge-neon lime">INQUIRIES</span>
            <h2 className="section-title">START YOUR <span>JOURNEY TODAY</span></h2>
            <p className="section-subtitle">
              Fill out the form below and one of our conditioning experts will tailor your training options.
            </p>
          </div>

          <InquiryForm prefilledSubject={prefilledSubject} />
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="titan-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <div className="logo-area">
              <Dumbbell className="logo-icon" />
              <span className="logo-text">GAINZ<span>GYM</span></span>
            </div>
            <p>
              Premium athletic training centers designed to maximize performance, build mental toughness, and shape peak physical conditioning.
            </p>
          </div>

          <div className="footer-links">
            <h4>EXPLORE</h4>
            <a href="#plans-section">Memberships</a>
            <a href="#trainers-section">Trainers</a>
            <a href="#schedule-section">Class Timetable</a>
            <a href="#equipment-section">Equipment Specs</a>
          </div>

          <div className="footer-contact">
            <h4>GAINZ HQ</h4>
            <p className="footer-address">
              <MapPin size={16} className="accent-cyan-text" /> 100 Cyber Fitness Way, Austin, TX
            </p>
            <p className="footer-phone">
              <Phone size={16} className="accent-lime-text" /> +1 (800) 555-GAINZ
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Gainz Gym Arena. All Rights Reserved. Engineered for excellence.</p>
        </div>
      </footer>

      {/* 10. Full-Screen 360 Equipment Modal */}
      {selectedEquipment && (
        <Equipment360Viewer 
          equipment={selectedEquipment}
          onClose={() => setSelectedEquipment(null)}
          onInquireClick={handleInquireForEquipment}
        />
      )}

      {/* 11. Admin Authentication Modals */}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* 12. Admin Control Panel Dashboard */}
      {showAdminDashboard && (
        <AdminDashboard
          onClose={() => setShowAdminDashboard(false)}
          plans={plans}
          onPlanUpdated={handlePlanUpdated}
          onTrainerAdded={handleTrainerAdded}
          onEquipmentAdded={handleEquipmentAdded}
        />
      )}

      {/* Styled JSX for App structures */}
      <style>{`
        /* General layout settings */
        .titan-gym-app {
          background-color: var(--bg-primary);
        }

        .bg-primary { background-color: var(--bg-primary); }
        .bg-secondary { background-color: var(--bg-secondary); }

        /* Header Navigation */
        .main-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background: transparent;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          border-bottom: none;
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
          filter: drop-shadow(var(--shadow-neon-lime));
        }

        .logo-text {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.3rem;
          letter-spacing: 0.05em;
          color: #fff;
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
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
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
          background: rgba(255, 255, 255, 0.1);
          color: var(--accent-cyan);
          border-color: var(--accent-cyan);
        }

        .nav-admin-btn {
          background: rgba(var(--accent-gold-rgb), 0.1);
          border: 1px solid rgba(var(--accent-gold-rgb), 0.3);
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
          box-shadow: var(--shadow-neon-cyan);
        }

        .nav-admin-btn:hover {
          background: var(--accent-cyan);
          color: var(--bg-primary);
        }

        .nav-logout-btn {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: var(--transition-smooth);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-logout-btn:hover {
          background: #ef4444;
          color: #fff;
        }

        .nav-contact-btn {
          background: rgba(var(--accent-gold-rgb), 0.08);
          border: 1px solid rgba(var(--accent-gold-rgb), 0.2);
          padding: 8px 20px;
          border-radius: 6px;
          color: var(--accent-cyan) !important;
          box-shadow: var(--shadow-neon-cyan);
        }

        .nav-contact-btn:hover {
          background: var(--accent-cyan) !important;
          color: var(--bg-primary) !important;
          box-shadow: 0 0 20px rgba(var(--accent-gold-rgb), 0.4);
        }

        .mobile-menu-toggle {
          display: none;
          flex-direction: column;
          gap: 6px;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .mobile-menu-toggle span {
          background: #fff;
          height: 2px;
          width: 25px;
          border-radius: 2px;
        }

        /* Hero Banner */
        .hero-banner {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-top: 100px;
          background: url('${getImageUrl('/images/gym_hero_bg.png')}') center center / cover no-repeat;
          overflow: hidden;
        }

        .hero-bg-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(10, 11, 14, 0.7) 0%, rgba(10, 11, 14, 0.95) 100%);
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
          background: rgba(var(--accent-gold-rgb), 0.1);
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
        }

        .hero-title span {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 4px 12px rgba(182, 255, 0, 0.1));
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
          background: rgba(18, 20, 28, 0.7);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
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
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .highlight-item span {
          font-family: var(--font-display);
          font-size: 0.85rem;
          text-transform: uppercase;
          color: var(--text-secondary);
          letter-spacing: 0.05em;
        }

        /* Membership Plans */
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          margin-top: 40px;
        }

        .plan-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 48px 32px;
          background: rgba(15, 15, 19, 0.75);
          overflow: hidden;
          border-radius: 20px;
          border: 1px solid rgba(229, 192, 96, 0.12);
        }

        .plan-basic {
          border: 1px solid rgba(229, 192, 96, 0.15);
          box-shadow: 0 5px 20px rgba(229, 192, 96, 0.02);
        }
        .plan-basic:hover {
          border-color: var(--accent-gold);
          box-shadow: 0 10px 30px rgba(229, 192, 96, 0.15);
        }

        .plan-vip {
          border: 1px solid rgba(229, 192, 96, 0.35);
          background: linear-gradient(135deg, rgba(229, 192, 96, 0.12) 0%, rgba(15, 15, 19, 0.9) 100%);
          box-shadow: 0 5px 25px rgba(229, 192, 96, 0.05);
        }
        .plan-vip:hover {
          border-color: var(--accent-gold-bright);
          box-shadow: 0 10px 35px rgba(229, 192, 96, 0.25), var(--shadow-neon-cyan);
        }

        .plan-elite {
          border: 1px solid rgba(197, 155, 39, 0.45);
          background: linear-gradient(135deg, rgba(197, 155, 39, 0.18) 0%, rgba(15, 15, 19, 0.9) 100%);
          box-shadow: 0 5px 30px rgba(197, 155, 39, 0.05);
        }
        .plan-elite:hover {
          border-color: var(--accent-gold-bright);
          box-shadow: 0 10px 40px rgba(197, 155, 39, 0.25), 0 0 20px rgba(229, 192, 96, 0.2);
        }

        .btn-vip {
          background: var(--gradient-primary);
          color: #000;
          box-shadow: var(--shadow-neon-cyan);
        }
        .btn-vip:hover {
          background: #ffe359;
          box-shadow: 0 0 25px rgba(229, 192, 96, 0.7);
          transform: translateY(-2px);
        }

        .btn-elite {
          background: var(--gradient-orange);
          color: #fff;
          box-shadow: 0 0 15px rgba(197, 155, 39, 0.4);
        }
        .btn-elite:hover {
          box-shadow: 0 0 25px rgba(197, 155, 39, 0.7);
          transform: translateY(-2px);
        }

        .highlighted-plan {
          /* VIP popular highlight fallback */
          transform: scale(1.02);
        }
        .highlighted-plan:hover {
          transform: translateY(-8px) scale(1.03) !important;
        }

        .plan-popular-badge {
          position: absolute;
          top: 20px;
          right: -30px;
          background: var(--accent-cyan);
          color: var(--bg-primary);
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.7rem;
          text-transform: uppercase;
          padding: 6px 36px;
          transform: rotate(45deg);
          letter-spacing: 0.05em;
        }

        .plan-name {
          font-size: 1.5rem;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .plan-price-block {
          display: flex;
          align-items: baseline;
          margin-bottom: 32px;
        }

        .price-symbol {
          font-size: 1.8rem;
          color: var(--accent-lime);
          font-weight: 700;
          margin-right: 2px;
        }

        .price-value {
          font-size: 3.5rem;
          font-family: var(--font-display);
          font-weight: 700;
          line-height: 1;
        }

        .price-period {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-left: 8px;
        }

        .plan-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 40px;
          flex-grow: 1;
        }

        .plan-features li {
          font-size: 0.95rem;
          color: var(--text-secondary);
          padding-left: 24px;
          position: relative;
        }

        .plan-features li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--accent-lime);
          font-weight: bold;
        }

        .plan-btn {
          width: 100%;
          justify-content: center;
        }

        /* Trainers Profiles */
        .trainers-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
          margin-top: 40px;
        }

        .trainer-profile-card {
          padding: 0;
          overflow: hidden;
          background: rgba(18, 20, 28, 0.4);
          border-radius: 20px;
        }

        .trainer-photo-wrapper {
          position: relative;
          width: 100%;
          height: 280px;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .trainer-portrait {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-bounce);
        }

        .trainer-profile-card:hover .trainer-portrait {
          transform: scale(1.06);
        }

        .trainer-exp-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(10, 11, 14, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--accent-lime);
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.75rem;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .trainer-content {
          padding: 24px;
        }

        .trainer-spec {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-cyan);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
          display: block;
        }

        .trainer-name {
          font-size: 1.3rem;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .trainer-bio {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Equipment Catalog */
        .equipment-catalog-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          margin-top: 40px;
        }

        .equipment-catalog-card {
          padding: 0;
          overflow: hidden;
          background: rgba(18, 20, 28, 0.4);
          cursor: pointer;
          border-radius: 20px;
        }

        .eq-card-image-box {
          position: relative;
          height: 280px;
          background: #090a0d;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .eq-card-photo {
          width: 80%;
          height: 80%;
          object-fit: contain;
          transition: var(--transition-bounce);
        }

        .equipment-catalog-card:hover .eq-card-photo {
          transform: scale(1.05);
          filter: drop-shadow(0 0 15px rgba(var(--accent-gold-rgb), 0.2));
        }

        .eq-360-hover-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(10, 11, 14, 0.75);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: var(--transition-smooth);
        }

        .equipment-catalog-card:hover .eq-360-hover-overlay {
          opacity: 1;
        }

        .scan-indicator-hud {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--accent-cyan);
          border: 1px solid var(--accent-cyan);
          padding: 10px 20px;
          border-radius: 8px;
          background: rgba(var(--accent-gold-rgb), 0.05);
          box-shadow: var(--shadow-neon-cyan);
          display: flex;
          align-items: center;
          gap: 8px;
          animation: pulse 1.5s infinite;
        }

        .eq-card-info {
          padding: 24px;
        }

        .eq-card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .eq-cat {
          color: var(--accent-lime);
          text-transform: uppercase;
        }

        .eq-target {
          color: var(--text-muted);
        }

        .eq-card-title {
          font-size: 1.4rem;
          text-transform: uppercase;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: var(--transition-smooth);
        }

        .equipment-catalog-card:hover .eq-card-title {
          color: var(--accent-cyan);
        }

        .arrow-icon {
          opacity: 0.5;
          transition: var(--transition-smooth);
        }

        .equipment-catalog-card:hover .arrow-icon {
          opacity: 1;
          transform: translate(2px, -2px);
          color: var(--accent-cyan);
        }

        .eq-card-summary {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Gallery Masonry */
        .gallery-masonry {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 220px;
          gap: 20px;
          margin-top: 40px;
        }

        .gallery-brick {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .gallery-brick img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-smooth);
        }

        .gallery-brick.large {
          grid-column: span 2;
          grid-row: span 2;
        }

        .gallery-brick.tall {
          grid-row: span 2;
        }

        .brick-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 24px;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
          opacity: 0;
          transition: var(--transition-smooth);
        }

        .gallery-brick:hover img {
          transform: scale(1.05);
        }

        .gallery-brick:hover .brick-overlay {
          opacity: 1;
        }

        .brick-overlay h4 {
          font-family: var(--font-display);
          font-size: 0.95rem;
          color: #fff;
          letter-spacing: 0.05em;
        }

        /* Footer */
        .titan-footer {
          background: #06070a;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 80px 0 30px 0;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 60px;
        }

        .footer-brand p {
          margin-top: 20px;
          font-size: 0.9rem;
          max-width: 380px;
        }

        .footer-links h4,
        .footer-contact h4 {
          font-size: 0.85rem;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          margin-bottom: 24px;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-links a {
          font-size: 0.9rem;
          color: var(--text-secondary);
          transition: var(--transition-smooth);
          width: fit-content;
        }

        .footer-links a:hover {
          color: var(--accent-cyan);
          padding-left: 4px;
        }

        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-address,
        .footer-phone {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          padding-top: 30px;
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        /* Animations */
        @keyframes pulse {
          0% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
          100% { opacity: 0.8; transform: scale(1); }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .trainers-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .plans-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            max-width: 100%;
            margin: 40px auto 0 auto;
          }
          .plan-card {
            padding: 32px 18px;
          }
          .plan-name {
            font-size: 1.2rem;
            margin-bottom: 16px;
          }
          .plan-price-block {
            margin-bottom: 20px;
          }
          .price-value {
            font-size: 2.5rem;
          }
          .plan-features {
            gap: 12px;
            margin-bottom: 24px;
          }
          .plan-features li {
            font-size: 0.85rem;
            padding-left: 20px;
          }
          .plan-btn {
            padding: 12px 20px;
            font-size: 0.8rem;
          }
          .nav-bar {
            gap: 16px;
          }
          .nav-bar a {
            font-size: 0.8rem;
          }
          .nav-portal-btn, .nav-admin-btn, .nav-contact-btn {
            padding: 6px 14px;
            font-size: 0.8rem;
          }
          .hero-title {
            font-size: 3.5rem;
          }
        }

        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: flex;
          }
          .nav-bar {
            position: absolute;
            top: 80px;
            left: 0;
            width: 100%;
            background: var(--bg-secondary);
            border-bottom: 1px solid rgba(255,255,255,0.06);
            flex-direction: column;
            gap: 0;
            padding: 16px 0;
            display: none;
          }
          .nav-bar.open {
            display: flex;
          }
          .nav-bar a {
            width: 100%;
            padding: 14px 24px;
            border-bottom: 1px solid rgba(255,255,255,0.03);
            font-size: 0.9rem;
          }
          .nav-bar a:last-child {
            border: none;
            margin-top: 12px;
            width: 90%;
            text-align: center;
          }
          .plans-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin: 40px auto 0 auto;
            gap: 24px;
          }
          .plan-card {
            padding: 40px 24px;
          }
          .plan-name {
            font-size: 1.5rem;
            margin-bottom: 24px;
          }
          .plan-price-block {
            margin-bottom: 32px;
          }
          .price-value {
            font-size: 3.5rem;
          }
          .plan-features {
            gap: 16px;
            margin-bottom: 40px;
          }
          .plan-features li {
            font-size: 0.95rem;
            padding-left: 24px;
          }
          .plan-btn {
            padding: 14px 32px;
            font-size: 0.9rem;
          }
          .highlighted-plan {
            transform: none;
          }
          .plan-card:hover, .highlighted-plan:hover {
            transform: translateY(-4px) !important;
            box-shadow: 0 15px 30px rgba(229, 192, 96, 0.15), 0 0 15px rgba(197, 155, 39, 0.1) !important;
          }
          .hero-banner {
            min-height: auto;
            padding-top: 120px;
            padding-bottom: 0;
          }
          .hero-content-wrapper {
            margin-bottom: 0;
          }
          .hero-highlights-bar {
            position: relative;
            bottom: auto;
            left: auto;
            margin-top: 40px;
            background: rgba(18, 20, 28, 0.85);
          }
          .hero-title {
            font-size: 2.8rem;
          }
          .highlights-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .equipment-catalog-grid {
            grid-template-columns: 1fr;
          }
          .gallery-masonry {
            grid-template-columns: 1fr;
            grid-auto-rows: 180px;
          }
          .gallery-brick.large {
            grid-column: span 1;
            grid-row: span 1;
          }
          .gallery-brick.tall {
            grid-row: span 1;
          }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .hero-ctas {
            flex-direction: column;
          }
          .hero-ctas a {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

    </div>
  );
}
