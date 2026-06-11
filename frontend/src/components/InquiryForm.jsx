import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertTriangle, PhoneCall, Mail, MapPin, Loader2 } from 'lucide-react';

export default function InquiryForm({ prefilledSubject }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { success: boolean, message: string }

  // Sync pre-filled subject from equipment clicks
  useEffect(() => {
    if (prefilledSubject) {
      setFormData(prev => ({
        ...prev,
        subject: `Equipment Inquiry: ${prefilledSubject}`,
        message: `Hi, I would like to receive more details about the "${prefilledSubject}" and schedule a trial session.`
      }));
      
      // Auto-scroll to form if prefilled
      const element = document.getElementById('contact-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [prefilledSubject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // Basic Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      setStatus({ success: false, message: 'All fields are required.' });
      setLoading(false);
      return;
    }

    try {
      const host = window.location.hostname === 'localhost' ? 'http://localhost:5001' : '';
      const response = await fetch(`${host}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ success: true, message: 'Your inquiry has been successfully transmitted to the Gainz Gym team. We will contact you shortly!' });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setStatus({ success: false, message: data.error || 'Failed to submit inquiry.' });
      }
    } catch (err) {
      console.error('Inquiry submission error:', err);
      setStatus({ success: false, message: 'Network connection issue. Please verify the backend server is running.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inquiry-container" id="contact-section">
      
      <div className="inquiry-grid">
        
        {/* Left column: Contact Info */}
        <div className="contact-info-column glass-card">
          <span className="badge-neon lime">GET IN TOUCH</span>
          <h3 className="info-title">Let's Build Your Physique</h3>
          <p className="info-desc">
            Have questions about memberships, personal trainers, or equipment? Send us an inquiry, or visit the Gainz Gym Arena.
          </p>

          <div className="info-cards">
            
            <div className="info-item-card">
              <div className="info-icon cyan-glow"><PhoneCall size={20} /></div>
              <div className="info-text">
                <span className="info-label">Call Us</span>
                <a href="tel:+18005554246" className="info-value">+1 (800) 555-GAINZ</a>
              </div>
            </div>

            <div className="info-item-card">
              <div className="info-icon lime-glow"><Mail size={20} /></div>
              <div className="info-text">
                <span className="info-label">Email Support</span>
                <a href="mailto:join@gainzgym.com" className="info-value">join@gainzgym.com</a>
              </div>
            </div>

            <div className="info-item-card">
              <div className="info-icon cyan-glow"><MapPin size={20} /></div>
              <div className="info-text">
                <span className="info-label">Gainz Gym Arena</span>
                <span className="info-value">100 Cyber Fitness Way, Austin, TX</span>
              </div>
            </div>

          </div>

          <div className="hours-block">
            <h4>OPERATING HOURS</h4>
            <div className="hours-row"><span>Monday - Friday</span><strong>24 Hours</strong></div>
            <div className="hours-row"><span>Saturday - Sunday</span><strong>6:00 AM - 10:00 PM</strong></div>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="form-column glass-card">
          <h3 className="form-title">Send An Inquiry</h3>
          
          {status && (
            <div className={`form-alert ${status.success ? 'success' : 'error'}`}>
              {status.success ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
              <span>{status.message}</span>
            </div>
          )}

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
                placeholder="Membership Inquiry / Trainer Question"
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
                placeholder="How can we help you achieve your goals?"
                rows={5}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary form-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Send Inquiry</span>
                </>
              )}
            </button>

          </form>
        </div>

      </div>

      <style>{`
        .inquiry-container {
          width: 100%;
        }

        .inquiry-grid {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 32px;
          align-items: stretch;
        }

        /* Left Side Info Column */
        .contact-info-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: rgba(18, 20, 28, 0.4);
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
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
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
          background: rgba(var(--accent-cyan-rgb), 0.1);
          color: var(--accent-cyan);
          border: 1px solid rgba(var(--accent-cyan-rgb), 0.2);
          box-shadow: 0 0 10px rgba(var(--accent-cyan-rgb), 0.1);
        }

        .info-icon.lime-glow {
          background: rgba(var(--accent-lime-rgb), 0.1);
          color: var(--accent-lime);
          border: 1px solid rgba(var(--accent-lime-rgb), 0.2);
          box-shadow: 0 0 10px rgba(var(--accent-lime-rgb), 0.1);
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
          letter-spacing: 0.05em;
        }

        .info-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .hours-block {
          margin-top: auto;
          background: rgba(0, 0, 0, 0.2);
          padding: 16px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .hours-block h4 {
          font-size: 0.85rem;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }

        .hours-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          padding: 6px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
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

        /* Right Side Form Column */
        .form-title {
          font-size: 1.8rem;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .form-alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border-radius: 8px;
          font-size: 0.9rem;
          margin-bottom: 24px;
          animation: slideDown 0.3s ease-out;
        }

        .form-alert.success {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .form-alert.error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
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
          letter-spacing: 0.05em;
          color: var(--text-secondary);
        }

        .input-field input,
        .input-field textarea {
          background: var(--bg-tertiary);
          border: 1px solid rgba(255, 255, 255, 0.08);
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
          box-shadow: 0 0 10px rgba(var(--accent-cyan-rgb), 0.2);
          background: rgba(var(--accent-cyan-rgb), 0.02);
        }

        .input-field textarea {
          resize: vertical;
        }

        .form-submit-btn {
          margin-top: 10px;
          width: 100%;
          justify-content: center;
          gap: 10px;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Responsive */
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
