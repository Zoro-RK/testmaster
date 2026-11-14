import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  UploadCloud, 
  FileText, 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  ArrowRight 
} from 'lucide-react';
import { api } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function TestLibraryPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [partFilter, setPartFilter] = useState('all');
  const [attemptFilter, setAttemptFilter] = useState('all');

  useEffect(() => {
    async function loadTests() {
      try {
        setLoading(true);
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (partFilter !== 'all') params.partId = partFilter;
        if (attemptFilter !== 'all') params.attemptState = attemptFilter;

        const res = await api.getTests(params);
        setTests(res.tests || []);
      } catch (err) {
        console.error('Failed to load tests:', err);
      } finally {
        setLoading(false);
      }
    }
    const timer = setTimeout(loadTests, 200);
    return () => clearTimeout(timer);
  }, [search, partFilter, attemptFilter]);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Group Test Library</h1>
          <p className="page-subtitle">
            Practice mock tests created by study circle members. Scored server-side with zero friend ranking.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/tests/my" className="btn btn-secondary">
            <FileText size={16} /> My Authored Tests
          </Link>
          <Link to="/tests/upload" className="btn btn-primary">
            <UploadCloud size={16} /> Upload Test
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--color-line)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        marginBottom: '28px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '400px' }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Search tests by title or topic…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search size={16} color="var(--color-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* Filter Dropdowns */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ink-700)' }}>Part:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '8px 12px', fontSize: '13px' }}
              value={partFilter}
              onChange={(e) => setPartFilter(e.target.value)}
            >
              <option value="all">All Parts</option>
              <option value="A">Part A: General Studies</option>
              <option value="B">Part B: Aptitude</option>
              <option value="C">Part C: Tamil Eligibility</option>
              <option value="C_EN">Part C: General English</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ink-700)' }}>Status:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '8px 12px', fontSize: '13px' }}
              value={attemptFilter}
              onChange={(e) => setAttemptFilter(e.target.value)}
            >
              <option value="all">All Tests</option>
              <option value="not_attempted">Not Attempted</option>
              <option value="in_progress">In Progress</option>
              <option value="attempted">Attempted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-muted)' }}>
          Loading tests…
        </div>
      ) : tests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <FileText size={44} color="var(--color-muted)" style={{ margin: '0 auto 14px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>No practice tests found</h3>
          <p style={{ fontSize: '14px', color: 'var(--color-muted)', marginTop: '4px' }}>
            {search ? 'Try clearing your search keyword.' : 'Upload a JSON question paper to publish the first test!'}
          </p>
          <div style={{ marginTop: '18px' }}>
            <Link to="/tests/upload" className="btn btn-primary">
              <UploadCloud size={16} /> Upload Test
            </Link>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {tests.map(test => {
            return (
              <div key={test.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  {/* Top tags */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="status-chip status-notStarted" style={{ fontSize: '11px', padding: '3px 8px' }}>
                      {test.partName || test.partCode}
                    </span>

                    {/* Attempt State Chip */}
                    {test.attemptState === 'attempted' && (
                      <span className="status-chip status-completed" style={{ fontSize: '11px' }}>
                        <CheckCircle2 size={12} /> Attempted
                      </span>
                    )}
                    {test.attemptState === 'in_progress' && (
                      <span className="status-chip status-inProgress" style={{ fontSize: '11px' }}>
                        <Clock size={12} /> In Progress
                      </span>
                    )}
                    {test.attemptState === 'not_attempted' && (
                      <span style={{ fontSize: '11px', color: 'var(--color-muted)', fontWeight: 600 }}>
                        Not Attempted
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-ink-900)', lineHeight: 1.3 }}>
                    {test.title}
                  </h3>

                  {test.description && (
                    <p style={{ fontSize: '13px', color: 'var(--color-ink-700)', marginTop: '6px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {test.description}
                    </p>
                  )}

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '12px',
                    color: 'var(--color-muted)',
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--color-line)'
                  }}>
                    <span>{test.questionCount} Questions</span>
                    <span>•</span>
                    <span>{test.durationMinutes} Minutes</span>
                    <span>•</span>
                    <span>{test.language}</span>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '6px' }}>
                    Created by <strong>{test.creator?.displayName || 'Demo'}</strong>
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <Link
                    to={`/tests/${test.id}`}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {test.attemptState === 'in_progress' ? (
                      <>Resume Attempt <ArrowRight size={15} /></>
                    ) : test.attemptState === 'attempted' ? (
                      <>Review or Retake <ArrowRight size={15} /></>
                    ) : (
                      <>Start Test <PlayCircle size={15} /></>
                    )}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

