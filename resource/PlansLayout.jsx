import React from 'react';

/*
  REUSABLE PRICING PLANS GRID LAYOUT
  - Responsive tablet column adjustments (keeps side-by-side comparison on iPad size)
  - Custom glassmorphic cards
  - Standard/VIP/Elite highlight styles
*/
export default function PlansLayout({
  plans = [
    {
      id: 1,
      name: "Basic Access",
      price: 2499,
      period: "month",
      features: ["Gym floor access", "Locker room & showers", "1 Fitness assessment", "Standard hours"],
      badge: null,
      type: "basic"
    },
    {
      id: 2,
      name: "Gainz VIP",
      price: 4999,
      period: "month",
      features: ["24/7 Unlimited Access", "All Group Fitness Classes", "Sauna & recovery lounge", "Free customized meal plan"],
      badge: "Popular",
      type: "vip"
    },
    {
      id: 3,
      name: "Elite Warrior",
      price: 12499,
      period: "month",
      features: ["Everything in VIP", "Unlimited Personal Training", "Cryo/Compression therapies", "Monthly body scan"],
      badge: "Best Value",
      type: "elite"
    }
  ],
  onAccessClick
}) {
  return (
    <div className="plans-grid">
      {plans.map((plan) => {
        const typeClass = plan.type ? `plan-${plan.type}` : '';
        const highlightedClass = plan.badge ? 'highlighted-plan' : '';
        
        return (
          <div 
            key={plan.id} 
            className={`plan-card glass-card ${typeClass} ${highlightedClass}`}
          >
            {plan.badge && <div className="plan-popular-badge">{plan.badge}</div>}
            
            <h3 className="plan-name">{plan.name}</h3>
            
            <div className="plan-price-block">
              <span className="price-symbol">₹</span>
              <span className="price-value">{plan.price.toLocaleString('en-IN')}</span>
              <span className="price-period">/ {plan.period}</span>
            </div>
            
            <ul className="plan-features">
              {plan.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
            
            <button 
              className={`btn plan-btn ${plan.type === 'vip' ? 'btn-vip' : plan.type === 'elite' ? 'btn-elite' : 'btn-secondary'}`}
              onClick={() => onAccessClick && onAccessClick(plan)}
            >
              Acquire Access
            </button>
          </div>
        );
      })}

      <style>{`
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
          background: rgba(255, 255, 255, 0.8);
          overflow: hidden;
          border-radius: 20px;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .plan-basic {
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }
        .plan-basic:hover {
          border-color: var(--accent-gold);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
        }

        .plan-vip {
          border: 1px solid rgba(var(--accent-gold-rgb), 0.25);
          background: linear-gradient(135deg, rgba(var(--accent-gold-rgb), 0.06) 0%, rgba(255, 255, 255, 0.95) 100%);
          box-shadow: 0 4px 20px rgba(var(--accent-gold-rgb), 0.04);
        }
        .plan-vip:hover {
          border-color: var(--accent-gold-bright);
          box-shadow: 0 12px 30px rgba(var(--accent-gold-rgb), 0.15);
        }

        .plan-elite {
          border: 1px solid rgba(var(--accent-lime-rgb), 0.35);
          background: linear-gradient(135deg, rgba(var(--accent-lime-rgb), 0.08) 0%, rgba(255, 255, 255, 0.95) 100%);
          box-shadow: 0 4px 20px rgba(var(--accent-lime-rgb), 0.04);
        }
        .plan-elite:hover {
          border-color: var(--accent-gold-bright);
          box-shadow: 0 12px 30px rgba(var(--accent-lime-rgb), 0.15);
        }

        .plan-name {
          font-size: 1.5rem;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .plan-price-block {
          display: flex;
          align-items: baseline;
          margin-bottom: 30px;
        }

        .price-symbol {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .price-value {
          font-family: var(--font-display);
          font-size: 3.2rem;
          font-weight: 800;
          line-height: 1;
          color: var(--text-primary);
        }

        .price-period {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-left: 8px;
        }

        .plan-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 40px;
          flex: 1;
        }

        .plan-features li {
          font-size: 0.95rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .plan-features li::before {
          content: '•';
          color: var(--accent-gold);
          font-size: 1.25rem;
        }

        .plan-btn {
          width: 100%;
          justify-content: center;
        }

        .btn-vip {
          background: #111111;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .btn-vip:hover {
          background: #2b2b2b;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }

        .btn-elite {
          background: var(--accent-gold);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(var(--accent-gold-rgb), 0.15);
        }
        .btn-elite:hover {
          background: var(--accent-gold-bright);
          box-shadow: 0 6px 16px rgba(var(--accent-gold-rgb), 0.25);
          transform: translateY(-2px);
        }

        .highlighted-plan {
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
          color: #ffffff;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.7rem;
          text-transform: uppercase;
          padding: 6px 36px;
          transform: rotate(45deg);
          letter-spacing: 0.08em;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .plans-grid {
            gap: 16px;
          }
          .plan-card {
            padding: 32px 18px;
          }
          .plan-name {
            font-size: 1.2rem;
          }
          .price-value {
            font-size: 2.5rem;
          }
          .plan-features li {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 768px) {
          .plans-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin: 40px auto 0 auto;
            gap: 24px;
          }
          .plan-card {
            padding: 40px 24px;
          }
          .highlighted-plan {
            transform: none;
          }
          .highlighted-plan:hover {
            transform: translateY(-4px) !important;
          }
        }
      `}</style>
    </div>
  );
}
