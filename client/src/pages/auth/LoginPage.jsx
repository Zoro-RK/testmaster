import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide your email address and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card auth-card" style={{ padding: '36px 32px' }}>
      {/* Mobile-only logo */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <Logo variant="stacked" size={40} />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-ink-900)' }}>
          Welcome back
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--color-ink-700)', marginTop: '6px' }}>
          Sign in to continue your Group IV preparation.
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'var(--color-danger-light)',
          border: '1px solid #f5c2c2',
          color: 'var(--color-danger)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '13px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="login-email">Your Name or Email Address</label>
          <div style={{ position: 'relative' }}>
            <input
              id="login-email"
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder="e.g. Anand Murugan or senthil@studycircle.tnpsc"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
            <User size={16} color="var(--color-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label" htmlFor="login-password">Password</label>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              style={{ paddingLeft: '38px', paddingRight: '40px' }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <Lock size={16} color="var(--color-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-muted)'
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '8px', padding: '12px' }}
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign in to Circle'}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>

      <div style={{
        marginTop: '28px',
        textAlign: 'center',
        borderTop: '1px solid var(--color-line)',
        paddingTop: '20px',
        fontSize: '13px',
        color: 'var(--color-ink-700)'
      }}>
        New to this private study circle?{' '}
        <Link to="/register" style={{ fontWeight: 700, color: 'var(--color-teal-700)' }}>
          Create Account / Join
        </Link>
      </div>
    </div>
  );
}

