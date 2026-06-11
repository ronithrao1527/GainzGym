import React, { useState } from 'react';
import { X, Lock, User, Loader2 } from 'lucide-react';
import { getApiHost } from '../utils/api';

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const host = getApiHost();
      const response = await fetch(`${host}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data.token, data.user);
        onClose();
      } else {
        setError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      console.error('Login connection error:', err);
      setError('Backend connection error. Make sure the Gainz Gym server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-card glass-card">
        <button className="close-btn" onClick={onClose} aria-label="Close portal">
          <X size={20} />
        </button>

        <div className="login-header">
          <div className="lock-icon-wrapper"><Lock size={22} /></div>
          <h3>Admin Control Center</h3>
          <p>Sign in to manage the Gainz Gym inventory, pricing, and view customer inquiries.</p>
        </div>

        {error && <div className="login-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <User size={16} className="input-icon" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>

      <style>{`
        .login-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }

        .login-modal-card {
          width: 100%;
          max-width: 440px;
          position: relative;
          padding: 40px !important;
          background: #ffffff;
          border: 1px solid var(--border-color);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
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

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .lock-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(var(--accent-cyan-rgb), 0.08);
          color: var(--accent-cyan);
          border: 1px solid rgba(var(--accent-cyan-rgb), 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
          box-shadow: none;
        }

        .login-header h3 {
          font-size: 1.5rem;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .login-header p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .login-error-alert {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 12px;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-bottom: 20px;
          text-align: center;
          animation: shake 0.3s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .login-field label {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .input-wrapper input {
          width: 100%;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.12);
          color: var(--text-primary);
          padding: 12px 16px 12px 42px;
          border-radius: 8px;
          outline: none;
          font-size: 0.95rem;
          transition: var(--transition-smooth);
        }

        .input-wrapper input:focus {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 0 3px rgba(var(--accent-cyan-rgb), 0.15);
        }

        .login-btn {
          width: 100%;
          justify-content: center;
          margin-top: 10px;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
