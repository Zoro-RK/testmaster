import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Bookmark, 
  RotateCcw, 
  ArrowLeft, 
  BookOpen, 
  ShieldCheck, 
  Filter,
  Check
} from 'lucide-react';
import { api } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function ExamResultPage() {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'correct', 'incorrect', 'unanswered', 'bookmarked'
  const [bookmarkMap, setBookmarkMap] = useState({});

  useEffect(() => {
    async function loadResult() {
      try {
        setLoading(true);
        const res = await api.getResult(attemptId);
        setResult(res.result);

        const bm = {};
        res.result.questions?.forEach(q => {
          if (q.isBookmarked) bm[q.id] = true;
        });
        setBookmarkMap(bm);
      } catch (err) {
        alert('Failed to load result: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadResult();
  }, [attemptId]);

  const handleToggleBookmark = async (question) => {
    try {
      const isCurrentlyBookmarked = Boolean(bookmarkMap[question.id]);
      const res = await api.toggleBookmark({
        questionId: question.id,
        testId: result.testId,
        questionSnapshot: question
      });
      setBookmarkMap(prev => ({
        ...prev,
        [question.id]: res.isBookmarked
      }));
    } catch (err) {
      alert('Failed to update bookmark: ' + err.message);
    }
  };

  if (loading) return <LoadingScreen message="Calculating results and explanations…" />;
  if (!result) return <div className="page-container">Test result not found.</div>;

  const { score, totalQuestions, percentage, correctCount, incorrectCount, unansweredCount, questions = [] } = result;

  // Filter questions
  let displayedQuestions = questions;
  if (filterMode === 'correct') {
    displayedQuestions = questions.filter(q => q.isCorrect);
  } else if (filterMode === 'incorrect') {
    displayedQuestions = questions.filter(q => !q.isCorrect && q.selectedOption);
  } else if (filterMode === 'unanswered') {
    displayedQuestions = questions.filter(q => !q.selectedOption);
  } else if (filterMode === 'bookmarked') {
    displayedQuestions = questions.filter(q => bookmarkMap[q.id]);
  }

  return (
    <div className="page-container" style={{ maxWidth: '960px' }}>
      <Link to="/tests" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '20px', color: 'var(--color-ink-700)' }}>
        <ArrowLeft size={16} /> Back to Test Library
      </Link>

      {/* Main Score & Summary Card */}
      <div className="card" style={{ padding: '36px', marginBottom: '28px', backgroundColor: 'var(--color-white)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-teal-700)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Examination Result
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-ink-900)', marginTop: '4px' }}>
              {result.testTitle}
            </h1>
            <div style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '4px' }}>
              Submitted on {new Date(result.submittedAt).toLocaleString()}
            </div>
          </div>

          {/* Large Score Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: 'var(--color-teal-100)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-teal-700)'
          }}>
            <span style={{ fontSize: '36px', fontWeight: 900 }}>{score}</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ink-700)' }}>/ {totalQuestions}</span>
            <span style={{ fontSize: '14px', fontWeight: 800, marginLeft: '8px', padding: '2px 8px', borderRadius: 'var(--radius-pill)', backgroundColor: 'var(--color-white)' }}>
              {percentage}%
            </span>
          </div>
        </div>

        {/* Breakdown counters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px',
          margin: '28px 0 20px',
          textAlign: 'center'
        }}>
          <div style={{ padding: '16px', backgroundColor: 'var(--color-success-light)', borderRadius: 'var(--radius-sm)', border: '1px solid #cce8d9' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-success)' }}>{correctCount}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 700, marginTop: '2px' }}>Correct Answers</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: 'var(--color-danger-light)', borderRadius: 'var(--radius-sm)', border: '1px solid #f7cfcf' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-danger)' }}>{incorrectCount}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-danger)', fontWeight: 700, marginTop: '2px' }}>Incorrect Answers</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: 'var(--color-paper-100)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-line)' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-muted)' }}>{unansweredCount}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontWeight: 700, marginTop: '2px' }}>Unanswered</div>
          </div>
        </div>

        {/* Privacy Note */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--color-muted)' }}>
          <ShieldCheck size={16} color="var(--color-teal-700)" />
          <span>This result is confidential to your personal account. Scores are never visible to friends or used in leaderboards.</span>
        </div>
      </div>

      {/* Review Filter Navigation Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Question-by-Question Review</h2>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: `All (${questions.length})` },
            { key: 'correct', label: `Correct (${correctCount})` },
            { key: 'incorrect', label: `Incorrect (${incorrectCount})` },
            { key: 'unanswered', label: `Unanswered (${unansweredCount})` },
            { key: 'bookmarked', label: `Bookmarked (${Object.values(bookmarkMap).filter(Boolean).length})` }
          ].map(flt => (
            <button
              key={flt.key}
              onClick={() => setFilterMode(flt.key)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid',
                borderColor: filterMode === flt.key ? 'var(--color-teal-700)' : 'var(--color-line)',
                backgroundColor: filterMode === flt.key ? 'var(--color-teal-100)' : 'var(--color-white)',
                color: filterMode === flt.key ? 'var(--color-teal-700)' : 'var(--color-ink-700)'
              }}
            >
              {flt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Review List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {displayedQuestions.map((q, idx) => {
          const isBookmarked = Boolean(bookmarkMap[q.id]);
          return (
            <div key={q.id} className="card" style={{ padding: '24px' }}>
              {/* Question Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-ink-900)' }}>
                    Question {q.index + 1}
                  </span>

                  {q.isCorrect ? (
                    <span className="status-chip status-completed" style={{ fontSize: '11px' }}>
                      <CheckCircle2 size={12} /> Correct (+1)
                    </span>
                  ) : q.selectedOption ? (
                    <span className="status-chip status-revisionNeeded" style={{ fontSize: '11px' }}>
                      <XCircle size={12} /> Incorrect (0)
                    </span>
                  ) : (
                    <span className="status-chip status-notStarted" style={{ fontSize: '11px' }}>
                      Not Attempted (0)
                    </span>
                  )}
                </div>

                {/* Bookmark Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleBookmark(q)}
                  className="btn btn-ghost"
                  style={{
                    padding: '6px 10px',
                    fontSize: '12px',
                    color: isBookmarked ? 'var(--color-saffron-500)' : 'var(--color-muted)'
                  }}
                  title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                >
                  <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
              </div>

              {/* Question Text */}
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ink-900)', lineHeight: 1.45, marginBottom: '18px' }}>
                {q.question}
              </div>

              {/* Options Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                {q.options?.map((opt) => {
                  const isOfficialCorrect = opt.key === q.correctAnswer;
                  const isUserSelection = opt.key === q.selectedOption;

                  let optBg = 'var(--color-white)';
                  let optBorder = 'var(--color-line)';
                  let optColor = 'var(--color-ink-900)';

                  if (isOfficialCorrect) {
                    optBg = 'var(--color-success-light)';
                    optBorder = 'var(--color-success)';
                  } else if (isUserSelection && !isOfficialCorrect) {
                    optBg = 'var(--color-danger-light)';
                    optBorder = 'var(--color-danger)';
                  }

                  return (
                    <div
                      key={opt.key}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: `1.5px solid ${optBorder}`,
                        backgroundColor: optBg,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '13px'
                      }}
                    >
                      <span style={{ fontWeight: 800 }}>{opt.key}.</span>
                      <span style={{ flex: 1, color: optColor }}>{opt.text}</span>

                      {isOfficialCorrect && (
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <Check size={14} /> Correct Key
                        </span>
                      )}
                      {isUserSelection && !isOfficialCorrect && (
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-danger)' }}>
                          Your Choice
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Detailed Explanation */}
              <div style={{
                backgroundColor: 'var(--color-paper-100)',
                border: '1px solid var(--color-line)',
                padding: '14px 18px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                color: 'var(--color-ink-900)',
                lineHeight: 1.55
              }}>
                <strong style={{ color: 'var(--color-teal-700)', display: 'block', marginBottom: '4px' }}>
                  Explanation & Concept:
                </strong>
                {q.explanation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

