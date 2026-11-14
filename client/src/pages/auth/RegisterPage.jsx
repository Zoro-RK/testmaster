import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!displayName.trim()) {
      setError('Name is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await register(displayName.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card auth-card" style={{ padding: '36px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <Logo variant="stacked" size={38} />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-ink-900)' }}>
          Join Study Circle
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--color-ink-700)', marginTop: '4px' }}>
          Create your account and connect with your study group.
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
          <label className="form-label" htmlFor="reg-name">Your Name</label>
          <div style={{ position: 'relative' }}>
            <input
              id="reg-name"
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder="e.g. Anand Murugan"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              autoFocus
            />
            <User size={16} color="var(--color-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <span className="form-hint">This name will be visible to friends in the study circle directory.</span>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-password">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              style={{ paddingLeft: '38px', paddingRight: '40px' }}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
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
          style={{ width: '100%', marginTop: '12px', padding: '12px' }}
          disabled={loading}
        >
          {loading ? 'Creating account…' : 'Complete Registration'}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>

      <div style={{
        marginTop: '24px',
        textAlign: 'center',
        borderTop: '1px solid var(--color-line)',
        paddingTop: '18px',
        fontSize: '13px',
        color: 'var(--color-ink-700)'
      }}>
        Already registered?{' '}
        <Link to="/login" style={{ fontWeight: 700, color: 'var(--color-teal-700)' }}>
          Sign In
        </Link>
      </div>
    </div>
  );
}

