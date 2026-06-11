import React, { useState } from 'react';
import { Send, PhoneCall, Mail, MapPin } from 'lucide-react';

/*
  REUSABLE INQUIRY / CONTACT FORM GRID LAYOUT
  - 2-column responsive layout (Left Column: Contact details card, Right Column: Input form)
  - Styled inputs with modern focus rings
  - Muted visual elements for premium corporate appearance
*/
export default function InquiryFormLayout({
  title = "Let's Build Your Physique",
  description = "Have questions about memberships, personal trainers, or equipment? Send us an inquiry.",
  arenaName = "Gainz Gym Arena",
  arenaAddress = "100 Cyber Fitness Way, Austin, TX",
  phone = "+1 (800) 555-GAINZ",
  email = "join@gainzgym.com",
  onSubmitInquiry
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitInquiry) {
      onSubmitInquiry(formData);
    }
  };

  return (
    <div className="inquiry-grid">
      
      {/* Left Column: Contact details card */}
      <div className="contact-info-column glass-card">
        <span className="badge-neon lime">GET IN TOUCH</span>
        <h3 className="info-title">{title}</h3>
        <p className="info-desc">{description}</p>

        <div className="info-cards">
          
          <div className="info-item-card">
            <div className="info-icon cyan-glow"><PhoneCall size={20} /></div>
            <div className="info-text">
              <span className="info-label">Call Us</span>
              <a href={`tel:${phone}`} className="info-value">{phone}</a>
            </div>
          </div>

          <div className="info-item-card">
            <div className="info-icon lime-glow"><Mail size={20} /></div>
            <div className="info-text">
              <span className="info-label">Email Support</span>
              <a href={`mailto:${email}`} className="info-value">{email}</a>
            </div>
          </div>

          <div className="info-item-card">
            <div className="info-icon cyan-glow"><MapPin size={20} /></div>
            <div className="info-text">
              <span className="info-label">{arenaName}</span>
              <span className="info-value">{arenaAddress}</span>
            </div>
          </div>

        </div>

        <div className="hours-block">
          <h4>OPERATING HOURS</h4>
          <div className="hours-row"><span>Monday - Friday</span><strong>24 Hours</strong></div>
          <div className="hours-row"><span>Saturday - Sunday</span><strong>6:00 AM - 10:00 PM</strong></div>
        </div>
      </div>

      {/* Right Column: Input form */}
      <div className="form-column glass-card">
        <h3 className="form-title">Send An Inquiry</h3>

        <form onSubmit={handleSubmit} className="actual-form">
          <div className="input-group-row">
            <div className="input-field">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="input-field">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                required
              />
            </div>
          </div>

          <div className="input-field">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="input-field">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="How can we help?"
              required
            />
          </div>

          <div className="input-field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe your requirements..."
              rows={5}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary form-submit-btn">
            <Send size={18} />
            <span>Send Inquiry</span>
          </button>
        </form>
      </div>

      <style>{`
        .inquiry-grid {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 32px;
          align-items: stretch;
        }

        .contact-info-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: var(--bg-primary);
        }

        .info-title {
          font-size: 1.8rem;
          text-transform: uppercase;
        }

        .info-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .info-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin: 12px 0;
        }

        .info-item-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 14px;
          border-radius: 10px;
        }

        .info-icon {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .info-icon.cyan-glow {
          background: rgba(var(--accent-cyan-rgb), 0.08);
          color: var(--accent-cyan);
          border: 1px solid rgba(var(--accent-cyan-rgb), 0.15);
        }

        .info-icon.lime-glow {
          background: rgba(var(--accent-lime-rgb), 0.08);
          color: var(--accent-lime);
          border: 1px solid rgba(var(--accent-lime-rgb), 0.15);
        }

        .info-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .info-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .info-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .hours-block {
          margin-top: auto;
          background: var(--bg-secondary);
          padding: 16px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
        }

        .hours-block h4 {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 12px;
        }

        .hours-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          padding: 6px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .hours-row:last-child {
          border: none;
        }

        .hours-row span {
          color: var(--text-secondary);
        }

        .hours-row strong {
          color: var(--accent-cyan);
        }

        .form-title {
          font-size: 1.8rem;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .actual-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .input-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-field label {
          font-family: var(--font-display);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .input-field input,
        .input-field textarea {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.12);
          color: var(--text-primary);
          padding: 12px 16px;
          border-radius: 8px;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          outline: none;
          transition: var(--transition-smooth);
        }

        .input-field input:focus,
        .input-field textarea:focus {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 0 3px rgba(var(--accent-cyan-rgb), 0.15);
        }

        .input-field textarea {
          resize: vertical;
        }

        .form-submit-btn {
          margin-top: 10px;
          width: 100%;
          justify-content: center;
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .inquiry-grid {
            grid-template-columns: 1fr;
          }
          .input-group-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
