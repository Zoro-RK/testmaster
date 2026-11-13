import React, { useState } from 'react';
import { User, Settings, ShieldCheck, Key, Save, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function SettingsPage() {
  const { user, group, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [invitationCode, setInvitationCode] = useState(group?.invitationCode || 'TNPSC2025');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingGroup, setSavingGroup] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [groupSuccess, setGroupSuccess] = useState(false);

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

  const handleUpdateGroup = async (e) => {
    e.preventDefault();
    try {
      setSavingGroup(true);
      await api.updateGroupSettings({ invitationCode: invitationCode.trim() });
      await refreshUser();
      setGroupSuccess(true);
      setTimeout(() => setGroupSuccess(false), 2500);
    } catch (err) {
      alert('Failed to update group settings: ' + err.message);
    } finally {
      setSavingGroup(false);
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

      {/* Group Settings Card */}
      <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={18} color="var(--color-saffron-500)" />
          Study Circle Details
        </h3>

        <div style={{ marginBottom: '20px', fontSize: '14px', color: 'var(--color-ink-700)' }}>
          <div>Circle Name: <strong>{group?.name || 'TNPSC Study Circle'}</strong></div>
          <div style={{ marginTop: '4px' }}>Your Role: <strong>Circle Member</strong></div>
        </div>

        <div>
          {groupSuccess && (
            <div style={{ backgroundColor: 'var(--color-success-light)', border: '1px solid #cce8d9', color: 'var(--color-success)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} /> Group settings saved.
            </div>
          )}

          <form onSubmit={handleUpdateGroup}>
            <div className="form-group">
              <label className="form-label">Invitation Code for Friends</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '38px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                  required
                />
                <Key size={16} color="var(--color-saffron-500)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              <span className="form-hint">Share this code with friends so they can connect with this study circle.</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={savingGroup}
              style={{ marginTop: '8px' }}
            >
              <Save size={15} /> {savingGroup ? 'Updating…' : 'Update Group Code'}
            </button>
          </form>
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

