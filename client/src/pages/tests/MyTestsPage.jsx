import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle2, Archive, ArrowRight, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function MyTestsPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyTests();
  }, []);

  async function loadMyTests() {
    try {
      setLoading(true);
      const res = await api.getMyTests();
      setTests(res.tests || []);
    } catch (err) {
      console.error('Failed to load my tests:', err);
    } finally {
      setLoading(false);
    }
  }

  const handlePublish = async (testId) => {
    try {
      await api.publishTest(testId);
      loadMyTests();
    } catch (err) {
      alert('Failed to publish: ' + err.message);
    }
  };

  const handleArchive = async (testId) => {
    if (!confirm('Are you sure you want to archive this test?')) return;
    try {
      await api.archiveTest(testId);
      loadMyTests();
    } catch (err) {
      alert('Failed to archive: ' + err.message);
    }
  };

  if (loading) return <LoadingScreen message="Loading tests you created…" />;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <Link to="/tests" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: 'var(--color-ink-700)' }}>
            <ArrowLeft size={16} /> Back to Test Library
          </Link>
          <h1 className="page-title">My Authored Tests</h1>
          <p className="page-subtitle">
            Manage question papers you uploaded and published to the study circle.
          </p>
        </div>

        <Link to="/tests/upload" className="btn btn-primary">
          <UploadCloud size={16} /> Upload New Test
        </Link>
      </div>

      {tests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <FileText size={44} color="var(--color-muted)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>You haven’t uploaded any tests yet</h3>
          <p style={{ fontSize: '14px', color: 'var(--color-muted)', marginTop: '4px' }}>
            Contribute questions to help your friends practice.
          </p>
          <div style={{ marginTop: '16px' }}>
            <Link to="/tests/upload" className="btn btn-primary">
              <UploadCloud size={16} /> Upload Test
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {tests.map(t => (
            <div key={t._id || t.id} className="card" style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '6px' }}>
                  <span className={`status-chip status-${t.status === 'published' ? 'completed' : t.status === 'draft' ? 'inProgress' : 'notStarted'}`} style={{ fontSize: '11px' }}>
                    {t.status.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                    Version {t.currentVersion || 1} • {t.language}
                  </span>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-ink-900)' }}>
                  {t.title}
                </h3>

                <div style={{ display: 'flex', gap: '14px', fontSize: '13px', color: 'var(--color-muted)', marginTop: '6px' }}>
                  <span>{t.questionCount} Questions</span>
                  <span>•</span>
                  <span>{t.durationMinutes} Minutes</span>
                  <span>•</span>
                  <span>Created {new Date(t.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {t.status === 'draft' && (
                  <button
                    onClick={() => handlePublish(t._id || t.id)}
                    className="btn btn-primary"
                    style={{ fontSize: '13px' }}
                  >
                    Publish to Circle
                  </button>
                )}
                {t.status === 'published' && (
                  <Link
                    to={`/tests/${t._id || t.id}`}
                    className="btn btn-secondary"
                    style={{ fontSize: '13px' }}
                  >
                    View in Library
                  </Link>
                )}
                {t.status !== 'archived' && (
                  <button
                    onClick={() => handleArchive(t._id || t.id)}
                    className="btn btn-ghost"
                    style={{ fontSize: '13px', color: 'var(--color-danger)' }}
                    title="Archive test"
                  >
                    <Archive size={15} /> Archive
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

