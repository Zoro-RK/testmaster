import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, FileText, FolderDown, CheckCircle2, Clock, RotateCcw, Circle } from 'lucide-react';
import { api, BACKEND_URL } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function TopicDetailPage() {
  const { topicId } = useParams();
  const [data, setData] = useState(null);
  const [myPortion, setMyPortion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadTopic() {
      try {
        setLoading(true);
        const [topicRes, portionsRes] = await Promise.all([
          api.getTopicDetails(topicId),
          api.getMyPortions()
        ]);
        setData(topicRes);
        const found = portionsRes.portions?.find(p => String(p.topicId) === String(topicId));
        setMyPortion(found || { status: 'notStarted' });
      } catch (err) {
        console.error('Failed to load topic details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTopic();
  }, [topicId]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      const res = await api.updateMyPortion(topicId, { status: newStatus });
      setMyPortion(res.portion);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingScreen message="Loading topic details…" />;
  if (!data || !data.topic) return <div className="page-container">Topic not found.</div>;

  const { topic, tests = [], materials = [] } = data;

  return (
    <div className="page-container">
      <Link to="/syllabus" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '20px', color: 'var(--color-ink-700)' }}>
        <ArrowLeft size={16} /> Back to Syllabus Explorer
      </Link>

      {/* Main Topic Header Card */}
      <div className="card" style={{ padding: '32px', marginBottom: '28px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-teal-700)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
          {topic.part?.name} • {topic.unit?.code}: {topic.unit?.name}
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-ink-900)' }}>
          {topic.name}
        </h1>
        {topic.nameTa && topic.nameTa !== topic.name && (
          <div className="ta-text" style={{ fontSize: '16px', color: 'var(--color-ink-700)', marginTop: '4px' }}>
            {topic.nameTa}
          </div>
        )}

        {/* Current User Portion Status Pill & Change Controls */}
        <div style={{
          marginTop: '24px',
          padding: '18px 20px',
          backgroundColor: 'var(--color-paper-50)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontWeight: 600 }}>Your Preparation Status</div>
            <div style={{ marginTop: '4px' }}>
              <span className={`status-chip status-${myPortion?.status || 'notStarted'}`} style={{ fontSize: '13px', padding: '4px 12px' }}>
                <span style={{ textTransform: 'capitalize' }}>
                  {myPortion?.status === 'inProgress' ? 'In Progress' : myPortion?.status === 'revisionNeeded' ? 'Revision Needed' : myPortion?.status === 'completed' ? 'Completed' : 'Not Started'}
                </span>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { key: 'notStarted', label: 'Not Started' },
              { key: 'inProgress', label: 'In Progress' },
              { key: 'completed', label: 'Completed' },
              { key: 'revisionNeeded', label: 'Revision Needed' }
            ].map(st => (
              <button
                key={st.key}
                onClick={() => handleStatusChange(st.key)}
                disabled={updating || myPortion?.status === st.key}
                className="btn btn-secondary"
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  backgroundColor: myPortion?.status === st.key ? 'var(--color-teal-100)' : 'var(--color-white)',
                  color: myPortion?.status === st.key ? 'var(--color-teal-700)' : 'var(--color-ink-700)',
                  borderColor: myPortion?.status === st.key ? 'var(--color-teal-700)' : 'var(--color-line)'
                }}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Linked Tests & Study Materials */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Linked Tests Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--color-teal-700)" />
              Practice Tests for this Topic ({tests.length})
            </h3>
          </div>

          {tests.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--color-muted)', fontSize: '13px' }}>
              No practice tests published specifically for this topic yet.
              <div style={{ marginTop: '12px' }}>
                <Link to="/tests/upload" className="btn btn-secondary" style={{ fontSize: '12px' }}>
                  Upload a Test on this Topic
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tests.map(t => (
                <div key={t.id} style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{t.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                      {t.questionCount} Questions • {t.durationMinutes} Mins
                    </div>
                  </div>
                  <Link to={`/tests/${t.id}`} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Attempt
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Linked Materials Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FolderDown size={18} color="var(--color-saffron-500)" />
              Study Resources ({materials.length})
            </h3>
          </div>

          {materials.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--color-muted)', fontSize: '13px' }}>
              No study documents or PDF notes shared for this topic yet.
              <div style={{ marginTop: '12px' }}>
                <Link to="/materials" className="btn btn-secondary" style={{ fontSize: '12px' }}>
                  Share Study Material
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {materials.map(m => (
                <div key={m.id} style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{m.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>{m.fileName}</div>
                  </div>
                  <a href={m.fileName.startsWith('http') ? m.fileName : `${BACKEND_URL}/uploads/${m.fileName}`} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    View
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

