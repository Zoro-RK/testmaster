import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, RotateCcw, FileText, Calendar, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function FriendProfilePage() {
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('portions'); // 'portions' | 'tests'

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const res = await api.getMemberProfile(userId);
        setProfileData(res);
      } catch (err) {
        console.error('Failed to load friend profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [userId]);

  if (loading) return <LoadingScreen message="Loading friend’s shared study profile…" />;
  if (!profileData) return <div className="page-container">Friend profile not found.</div>;

  const { member, sharedPortions = [], publishedTests = [] } = profileData;

  const completedPortions = sharedPortions.filter(p => p.status === 'completed');
  const inProgressPortions = sharedPortions.filter(p => p.status === 'inProgress');

  return (
    <div className="page-container">
      <Link to="/friends" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '20px', color: 'var(--color-ink-700)' }}>
        <ArrowLeft size={16} /> Back to Friends Directory
      </Link>

      {/* Member Profile Header Card */}
      <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-teal-100)',
            color: 'var(--color-teal-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '24px'
          }}>
            {member.displayName.charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 800 }}>{member.displayName}</h1>
              <span className="status-chip status-notStarted" style={{ fontSize: '11px' }}>
                Circle Member
              </span>
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--color-muted)', marginTop: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} /> Joined {new Date(member.joinedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Quick stats pills */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ textAlign: 'center', padding: '10px 16px', backgroundColor: 'var(--color-paper-50)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-success)' }}>{completedPortions.length}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontWeight: 600 }}>Completed</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px 16px', backgroundColor: 'var(--color-paper-50)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-warning)' }}>{inProgressPortions.length}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontWeight: 600 }}>In Progress</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px 16px', backgroundColor: 'var(--color-paper-50)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-teal-700)' }}>{publishedTests.length}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontWeight: 600 }}>Tests Published</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--color-line)', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('portions')}
          style={{
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 700,
            borderBottom: '2px solid',
            borderColor: activeTab === 'portions' ? 'var(--color-teal-700)' : 'transparent',
            color: activeTab === 'portions' ? 'var(--color-teal-700)' : 'var(--color-ink-700)'
          }}
        >
          Shared Portions ({sharedPortions.length})
        </button>
        <button
          onClick={() => setActiveTab('tests')}
          style={{
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 700,
            borderBottom: '2px solid',
            borderColor: activeTab === 'tests' ? 'var(--color-teal-700)' : 'transparent',
            color: activeTab === 'tests' ? 'var(--color-teal-700)' : 'var(--color-ink-700)'
          }}
        >
          Tests Contributed ({publishedTests.length})
        </button>
      </div>

      {/* Tab 1: Shared Portions */}
      {activeTab === 'portions' && (
        <div>
          {sharedPortions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '36px' }}>
              <p style={{ color: 'var(--color-muted)' }}>This member has not yet recorded any portion updates.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sharedPortions.map(p => (
                <div key={p.topicId} className="card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-ink-900)' }}>
                      {p.topicName}
                    </div>
                    {p.completedAt && (
                      <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '2px' }}>
                        Completed on {new Date(p.completedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <span className={`status-chip status-${p.status}`}>
                    {p.status === 'completed' && <CheckCircle2 size={14} />}
                    {p.status === 'inProgress' && <Clock size={14} />}
                    {p.status === 'revisionNeeded' && <RotateCcw size={14} />}
                    <span style={{ textTransform: 'capitalize' }}>{p.status}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Tests Contributed */}
      {activeTab === 'tests' && (
        <div>
          {publishedTests.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '36px' }}>
              <p style={{ color: 'var(--color-muted)' }}>This member has not published any tests yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {publishedTests.map(t => (
                <div key={t.id} className="card">
                  <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{t.title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-ink-700)', marginTop: '4px' }}>{t.description}</p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--color-muted)', margin: '14px 0' }}>
                    <span>{t.questionCount} Questions</span>
                    <span>•</span>
                    <span>{t.durationMinutes} Minutes</span>
                    <span>•</span>
                    <span>{t.language}</span>
                  </div>
                  <Link to={`/tests/${t.id}`} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '13px' }}>
                    View & Start Test
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

