import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  RotateCcw, 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  Award, 
  ArrowRight,
  BookOpen,
  Calendar
} from 'lucide-react';
import { api } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function MyProgressPage() {
  const [data, setData] = useState(null);
  const [revisionQuestions, setRevisionQuestions] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'revision' | 'bookmarks' | 'history'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        setLoading(true);
        const [progRes, revRes, bmRes] = await Promise.all([
          api.getMyProgress(),
          api.getRevisionList(),
          api.getBookmarks()
        ]);
        setData(progRes);
        setRevisionQuestions(revRes.revisionQuestions || []);
        setBookmarks(bmRes.bookmarks || []);
      } catch (err) {
        console.error('Failed to load progress analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, []);

  if (loading) return <LoadingScreen message="Loading personal progress analytics…" />;
  if (!data) return <div className="page-container">No progress data found.</div>;

  const { portionProgress, attemptHistory = [] } = data;
  const unitBreakdown = portionProgress?.unitBreakdown || [];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Personal Progress & Revision</h1>
          <p className="page-subtitle">
            Private analysis of your syllabus portions, past attempts, and focused revision lists.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-scroll-container" style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-line)', marginBottom: '24px', overflowX: 'auto' }}>
        {[
          { key: 'overview', label: 'Unit Coverage' },
          { key: 'revision', label: `Revision Queue (${revisionQuestions.length})` },
          { key: 'bookmarks', label: `Bookmarks (${bookmarks.length})` },
          { key: 'history', label: `Attempt History (${attemptHistory.length})` }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: 700,
              borderBottom: '2px solid',
              borderColor: activeTab === tab.key ? 'var(--color-teal-700)' : 'transparent',
              color: activeTab === tab.key ? 'var(--color-teal-700)' : 'var(--color-ink-700)',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Unit Coverage Breakdown */}
      {activeTab === 'overview' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '28px'
          }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontWeight: 600 }}>Total Syllabus Topics</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--color-ink-900)', marginTop: '4px' }}>
                {portionProgress?.totalTopics}
              </div>
            </div>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontWeight: 600 }}>Completed Topics</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--color-success)', marginTop: '4px' }}>
                {portionProgress?.completedTopics}
              </div>
            </div>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontWeight: 600 }}>Tests Attempted</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--color-teal-700)', marginTop: '4px' }}>
                {attemptHistory.length}
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
            Unit-by-Unit Completion Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {unitBreakdown.map(u => (
              <div key={u.unitId} className="card" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-teal-700)' }}>
                      {u.unitCode} (Part {u.partCode})
                    </span>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-ink-900)' }}>
                      {u.unitName}
                    </h4>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-teal-700)' }}>
                      {u.completedTopics} / {u.totalTopics}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--color-muted)', marginLeft: '6px' }}>
                      ({u.percentage}%)
                    </span>
                  </div>
                </div>

                <div className="progress-bar-bg" style={{ height: '6px' }}>
                  <div className="progress-bar-fill" style={{ width: `${u.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Revision Queue (Questions answered incorrectly) */}
      {activeTab === 'revision' && (
        <div>
          <div style={{
            backgroundColor: 'var(--color-coral-100)',
            border: '1px solid #f2c7c0',
            padding: '14px 18px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px',
            fontSize: '13px',
            color: '#9e392c'
          }}>
            <strong>Focused Revision:</strong> Below are questions from your submitted tests where you selected an incorrect option. Review the explanations to reinforce your understanding.
          </div>

          {revisionQuestions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <CheckCircle2 size={40} color="var(--color-success)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '17px', fontWeight: 700 }}>Clean Revision Slate!</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '4px' }}>
                You have no incorrectly answered questions waiting in your revision queue.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {revisionQuestions.map((q, idx) => (
                <div key={q.id || idx} className="card" style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-coral-500)' }}>
                      Needs Revision • Test: {q.testTitle}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
                      Attempted {new Date(q.attemptDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ink-900)', marginBottom: '14px' }}>
                    {q.question}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', marginBottom: '14px' }}>
                    {q.options?.map((opt) => {
                      const isCorrect = opt.key === q.correctAnswer;
                      const wasSelected = opt.key === q.lastSelectedOption;
                      return (
                        <div
                          key={opt.key}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid',
                            borderColor: isCorrect ? 'var(--color-success)' : wasSelected ? 'var(--color-danger)' : 'var(--color-line)',
                            backgroundColor: isCorrect ? 'var(--color-success-light)' : wasSelected ? 'var(--color-danger-light)' : 'var(--color-white)',
                            fontSize: '13px'
                          }}
                        >
                          <strong>{opt.key}.</strong> {opt.text}
                          {isCorrect && <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 700, marginLeft: '6px' }}>(Correct)</span>}
                          {wasSelected && !isCorrect && <span style={{ fontSize: '11px', color: 'var(--color-danger)', fontWeight: 700, marginLeft: '6px' }}>(Your Answer)</span>}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div style={{ fontSize: '13px', backgroundColor: 'var(--color-paper-50)', padding: '12px 14px', borderRadius: 'var(--radius-sm)' }}>
                      <strong style={{ color: 'var(--color-teal-700)' }}>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div>
          {bookmarks.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <Bookmark size={40} color="var(--color-muted)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '17px', fontWeight: 700 }}>No Bookmarked Questions Yet</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '4px' }}>
                When reviewing your test results, click "Bookmark" to save challenging questions here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {bookmarks.map((bm, idx) => (
                <div key={bm._id || idx} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-saffron-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Bookmark size={14} fill="currentColor" /> Bookmarked Question
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
                      Saved on {new Date(bm.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {bm.questionSnapshot ? (
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-ink-900)', marginBottom: '12px' }}>
                        {bm.questionSnapshot.question}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginBottom: '12px' }}>
                        {bm.questionSnapshot.options?.map(opt => (
                          <div key={opt.key} style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-line)', fontSize: '13px', backgroundColor: opt.key === bm.questionSnapshot.correctAnswer ? 'var(--color-success-light)' : 'var(--color-white)' }}>
                            <strong>{opt.key}.</strong> {opt.text}
                          </div>
                        ))}
                      </div>
                      {bm.questionSnapshot.explanation && (
                        <div style={{ fontSize: '12px', color: 'var(--color-ink-700)', backgroundColor: 'var(--color-paper-50)', padding: '10px', borderRadius: '4px' }}>
                          <strong>Explanation:</strong> {bm.questionSnapshot.explanation}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: '14px', color: 'var(--color-ink-700)' }}>
                      Question ID: <strong>{bm.questionId}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Attempt History */}
      {activeTab === 'history' && (
        <div>
          {attemptHistory.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <Clock size={40} color="var(--color-muted)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '17px', fontWeight: 700 }}>No Test Attempts Yet</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '4px' }}>
                Browse the test library to attempt your first practice test.
              </p>
              <div style={{ marginTop: '16px' }}>
                <Link to="/tests" className="btn btn-primary">
                  Browse Tests
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {attemptHistory.map(a => (
                <div key={a.attemptId} className="card" style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-ink-900)' }}>
                      {a.testTitle}
                    </h4>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px' }}>
                      <span>Submitted: {new Date(a.submittedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Score: <strong style={{ color: 'var(--color-teal-700)' }}>{a.score} / {a.totalQuestions}</strong> ({a.percentage}%)</span>
                    </div>
                  </div>

                  <Link to={`/exam/result/${a.attemptId}`} className="btn btn-secondary" style={{ fontSize: '13px' }}>
                    View Result & Explanations <ArrowRight size={14} />
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

