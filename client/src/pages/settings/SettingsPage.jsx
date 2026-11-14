import React, { useState } from 'react';
import { User, Users, ShieldCheck, Save, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function SettingsPage() {
  const { user, group, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    try {
      setSavingProfile(true);
      await api.updateProfile({ displayName: displayName.trim() });
      await refreshUser();
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 2500);
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '780px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile & Group Settings</h1>
          <p className="page-subtitle">Manage your personal account and circle configuration.</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={18} color="var(--color-teal-700)" />
          Personal Profile
        </h3>

        {profileSuccess && (
          <div style={{ backgroundColor: 'var(--color-success-light)', border: '1px solid #cce8d9', color: 'var(--color-success)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Check size={16} /> Profile updated successfully.
          </div>
        )}

        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input
              type="text"
              className="form-input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
            <span className="form-hint">Visible to friends in the study directory.</span>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={user?.email || ''}
              disabled
              style={{ backgroundColor: 'var(--color-paper-100)', cursor: 'not-allowed' }}
            />
            <span className="form-hint">Email address is used for authentication and cannot be changed.</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={savingProfile}
            style={{ marginTop: '8px' }}
          >
            <Save size={15} /> {savingProfile ? 'Saving…' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Study Circle Details Card */}
      <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} color="var(--color-teal-700)" />
          Study Circle Details
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--color-ink-700)' }}>
          <div>Circle Name: <strong>{group?.name || 'TNPSC Group IV Study Circle'}</strong></div>
          <div>Your Role: <strong>Circle Member</strong></div>
          <div>Connection Mode: <strong style={{ color: 'var(--color-teal-700)' }}>Open Peer Circle (Automatic Friends)</strong></div>
          <div style={{ 
            backgroundColor: 'var(--color-paper-50)', 
            padding: '14px 18px', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--color-line)',
            fontSize: '13px',
            color: 'var(--color-ink-700)',
            lineHeight: 1.6
          }}>
            All registered members automatically connect as friends in this circle with immediate access to all shared study materials, question papers, and portion updates. No friend code or invitation code required.
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Card */}
      <div className="card" style={{ padding: '24px', backgroundColor: 'var(--color-paper-50)' }}>
        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-teal-700)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <ShieldCheck size={18} /> TNPSC Study Circle Privacy Model
        </h4>
        <p style={{ fontSize: '13px', color: 'var(--color-ink-700)', lineHeight: 1.6 }}>
          This platform is intentionally architected without leaderboards, rankings, or comparative scoreboards. Test attempts, correct/incorrect choices, and personal notes remain exclusively visible to your individual account.
        </p>
      </div>
    </div>
  );
}

