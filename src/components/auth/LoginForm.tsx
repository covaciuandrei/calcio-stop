import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import './Auth.css';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
  showRegisterLink?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, showRegisterLink = true }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <p className="auth-subtitle">Welcome back to Calcio Stop</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className={`auth-button primary ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {showRegisterLink && onSwitchToRegister && (
          <div className="auth-switch">
            <p>Don't have an account?</p>
            <button type="button" className="auth-link" onClick={onSwitchToRegister} disabled={isLoading}>
              Create Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
