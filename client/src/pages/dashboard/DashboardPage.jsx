import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Users, 
  Sparkles,
  BookOpen,
  FolderDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function DashboardPage() {
  const { user, group } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);
  const [recentTests, setRecentTests] = useState([]);
  const [activities, setActivities] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const [prog, testsRes, actRes, membersRes] = await Promise.all([
          api.getMyProgress().catch(() => null),
          api.getTests({ limit: 4 }).catch(() => ({ tests: [] })),
          api.getRecentActivity().catch(() => ({ activities: [] })),
          api.getMembers().catch(() => ({ members: [] }))
        ]);

        setProgressData(prog?.portionProgress);
        setRecentTests(testsRes?.tests?.slice(0, 4) || []);
        setActivities(actRes?.activities?.slice(0, 6) || []);
        setMembers(membersRes?.members?.slice(0, 4) || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingScreen message="Loading study circle dashboard…" />;
  }

  const completedCount = progressData?.completedTopics || 0;
  const inProgressCount = progressData?.inProgressTopics || 0;
  const totalTopics = progressData?.totalTopics || 85;
  const percentage = progressData?.overallPercentage || 0;

  return (
    <div className="page-container">
      {/* Top Welcome Banner */}
      <div style={{
        backgroundColor: 'var(--color-ink-900)',
        color: 'var(--color-white)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px 36px',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Subtle decorative curve */}
        <svg 
          style={{ position: 'absolute', right: -20, top: -20, width: '320px', height: '220px', opacity: 0.1, pointerEvents: 'none' }}
          viewBox="0 0 200 200"
          fill="none"
        >
          <path d="M20,100 C60,40 140,40 180,100 C140,160 60,160 20,100 Z" stroke="#FFFFFF" strokeWidth="6" />
          <circle cx="100" cy="100" r="24" fill="#E7A33E" />
        </svg>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(231, 163, 62, 0.2)',
            color: 'var(--color-saffron-500)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            marginBottom: '14px'
          }}>
            <Sparkles size={14} />
            <span>{group?.name || 'TNPSC Study Circle'}</span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-white)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Vanakkam, {user?.displayName}!
          </h1>
          <p style={{ fontSize: '15px', color: '#B5C4D0', marginTop: '8px', lineHeight: 1.5 }}>
            You have covered <strong>{completedCount}</strong> of <strong>{totalTopics}</strong> Group IV topics. Continue your preparation or practice with tests published by friends.
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '22px', flexWrap: 'wrap' }}>
            <Link to="/portions" className="btn btn-primary" style={{ backgroundColor: 'var(--color-teal-700)' }}>
              <Compass size={16} />
              Update My Portions
            </Link>
            <Link to="/tests" className="btn btn-secondary" style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)', color: 'var(--color-white)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
              <FileText size={16} />
              Browse Tests ({recentTests.length})
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Personal Progress & Quick Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Personal Progress Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700 }}>My Syllabus Coverage</h3>
            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-teal-700)' }}>{percentage}%</span>
          </div>

          <div className="progress-bar-bg" style={{ marginBottom: '18px', height: '10px' }}>
            <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
            <div style={{ padding: '12px 8px', backgroundColor: 'var(--color-paper-50)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-success)' }}>{completedCount}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontWeight: 600, marginTop: '2px' }}>Completed</div>
            </div>
            <div style={{ padding: '12px 8px', backgroundColor: 'var(--color-paper-50)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-warning)' }}>{inProgressCount}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontWeight: 600, marginTop: '2px' }}>In Progress</div>
            </div>
            <div style={{ padding: '12px 8px', backgroundColor: 'var(--color-paper-50)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-ink-700)' }}>{totalTopics - completedCount - inProgressCount}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontWeight: 600, marginTop: '2px' }}>Remaining</div>
            </div>
          </div>

          <Link to="/portions" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, marginTop: '16px', color: 'var(--color-teal-700)' }}>
            Open Portion Path <ArrowRight size={14} />
          </Link>
        </div>

        {/* Quick Action Hub */}
        <div className="card">
          <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px' }}>Quick Study Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/tests/upload" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-paper-50)',
              border: '1px solid var(--color-line)',
              color: 'var(--color-ink-900)'
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--color-teal-100)', color: 'var(--color-teal-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UploadCloud size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>Upload Practice Test</div>
                <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Import questions prepared externally via JSON</div>
              </div>
              <ArrowRight size={16} color="var(--color-muted)" />
            </Link>

            <Link to="/materials" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-paper-50)',
              border: '1px solid var(--color-line)',
              color: 'var(--color-ink-900)'
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--color-coral-100)', color: 'var(--color-coral-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FolderDown size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>Study Materials</div>
                <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Share or download PDF notes for syllabus units</div>
              </div>
              <ArrowRight size={16} color="var(--color-muted)" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Recently Published Tests & Circle Activity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px'
      }}>
        {/* Left: Recently Published Tests */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '19px', fontWeight: 700 }}>Recently Published Tests</h2>
            <Link to="/tests" style={{ fontSize: '13px', fontWeight: 700 }}>View all tests</Link>
          </div>

          {recentTests.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <FileText size={36} color="var(--color-muted)" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: 700 }}>No tests published yet</h4>
              <p style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '4px' }}>
                Be the first to upload and publish a practice test for your study circle!
              </p>
              <Link to="/tests/upload" className="btn btn-primary" style={{ marginTop: '16px' }}>
                Upload Test
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {recentTests.map((t) => (
                <div key={t.id} className="card" style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                      <span className="status-chip status-notStarted" style={{ fontSize: '11px', padding: '2px 8px' }}>
                        {t.partName || t.partCode || 'Part A'}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                        By {t.creator?.displayName || 'Friend'}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ink-900)' }}>
                      {t.title}
                    </h4>
                    <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: 'var(--color-ink-700)', marginTop: '6px' }}>
                      <span>{t.questionCount} Questions</span>
                      <span>•</span>
                      <span>{t.durationMinutes} Minutes</span>
                      <span>•</span>
                      <span>{t.language}</span>
                    </div>
                  </div>

                  <div>
                    <Link to={`/tests/${t.id}`} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '13px' }}>
                      View & Start <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Friends & Circle Activity Feed */}
        <div>
          {/* Active Friends Card */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="var(--color-teal-700)" />
                Study Circle Friends
              </h3>
              <Link to="/friends" style={{ fontSize: '12px', fontWeight: 700 }}>Directory</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {members.map(m => (
                <Link key={m.id} to={`/friends/${m.id}`} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-paper-50)',
                  transition: 'background 0.15s ease'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-teal-100)',
                    color: 'var(--color-teal-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '13px'
                  }}>
                    {m.displayName.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ink-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.displayName}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
                      {m.portionSummary?.completedCount || 0} topics completed
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="var(--color-muted)" />
              Recent Circle Activity
            </h3>

            {activities.length === 0 ? (
              <div style={{ fontSize: '13px', color: 'var(--color-muted)', textAlign: 'center', padding: '16px 0' }}>
                No recent activity recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activities.map(a => (
                  <div key={a.id} style={{ fontSize: '12px', borderLeft: '2px solid var(--color-teal-700)', paddingLeft: '10px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-ink-900)' }}>
                      {a.userDisplayName}
                    </div>
                    <div style={{ color: 'var(--color-ink-700)', marginTop: '2px' }}>
                      {a.details}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--color-muted)', marginTop: '2px' }}>
                      {new Date(a.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

