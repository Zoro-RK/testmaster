import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Bookmark, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Send, 
  AlertTriangle,
  Menu,
  X,
  ShieldAlert
} from 'lucide-react';
import { api } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function ExamPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: { selectedOption, markedForReview } }
  const [timeLeft, setTimeLeft] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    async function loadAttempt() {
      try {
        setLoading(true);
        const res = await api.getAttempt(attemptId);
        setAttempt(res.attempt);
        setQuestions(res.questions || []);
        setTimeLeft(res.attempt.remainingSeconds || 0);

        // Pre-fill saved answers
        const ansMap = {};
        res.attempt.answers?.forEach(a => {
          ansMap[a.questionId] = {
            selectedOption: a.selectedOption,
            markedForReview: Boolean(a.markedForReview)
          };
        });
        setAnswers(ansMap);
      } catch (err) {
        if (err.data?.isExpired) {
          alert('This exam has expired and was automatically submitted.');
          navigate(`/exam/result/${attemptId}`);
        } else {
          alert('Failed to load exam attempt: ' + err.message);
          navigate('/tests');
        }
      } finally {
        setLoading(false);
      }
    }
    loadAttempt();
  }, [attemptId, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  const handleSelectOption = async (optionKey) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const currentAns = answers[currentQ.id] || {};
    const newSelected = currentAns.selectedOption === optionKey ? null : optionKey;

    const updatedAns = {
      ...currentAns,
      selectedOption: newSelected
    };

    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: updatedAns
    }));

    // Autosave to server
    try {
      setSaving(true);
      await api.saveAnswer(attemptId, currentQ.id, updatedAns);
    } catch (err) {
      console.warn('Autosave warning:', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleReview = async () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const currentAns = answers[currentQ.id] || {};
    const updatedAns = {
      ...currentAns,
      markedForReview: !currentAns.markedForReview
    };

    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: updatedAns
    }));

    try {
      setSaving(true);
      await api.saveAnswer(attemptId, currentQ.id, updatedAns);
    } catch (err) {
      console.warn('Autosave warning:', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClearSelection = async () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const updatedAns = {
      selectedOption: null,
      markedForReview: false
    };

    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: updatedAns
    }));

    try {
      setSaving(true);
      await api.saveAnswer(attemptId, currentQ.id, updatedAns);
    } catch (err) {
      console.warn('Autosave error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAutoSubmit = async () => {
    alert('Time has expired! Submitting your answers automatically.');
    try {
      await api.submitAttempt(attemptId);
      navigate(`/exam/result/${attemptId}`);
    } catch (err) {
      navigate(`/exam/result/${attemptId}`);
    }
  };

  const handleManualSubmit = async () => {
    try {
      setSubmitting(true);
      await api.submitAttempt(attemptId);
      navigate(`/exam/result/${attemptId}`);
    } catch (err) {
      alert('Failed to submit exam: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingScreen message="Loading examination environment…" />;
  if (questions.length === 0) return <div className="page-container">No questions found in this test.</div>;

  const currentQ = questions[currentIndex];
  const currentAnswer = answers[currentQ?.id] || {};

  // Format timer MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeCritical = timeLeft < 300; // less than 5 minutes

  // Question stats for submit dialog
  const totalQuestions = questions.length;
  let answeredCount = 0;
  let markedCount = 0;
  questions.forEach(q => {
    const a = answers[q.id];
    if (a?.selectedOption) answeredCount++;
    if (a?.markedForReview) markedCount++;
  });
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-paper-50)' }}>
      {/* Fixed Examination Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--color-white)',
        borderBottom: '1px solid var(--color-line)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            TNPSC Group IV Examination
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-ink-900)' }}>
            {attempt?.testTitle}
          </h2>
        </div>

        {/* Center: Countdown Timer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-pill)',
          backgroundColor: isTimeCritical ? 'var(--color-danger-light)' : 'var(--color-teal-100)',
          color: isTimeCritical ? 'var(--color-danger)' : 'var(--color-teal-700)',
          fontWeight: 800,
          fontSize: '15px'
        }}>
          <Clock size={18} />
          <span>{timeFormatted}</span>
        </div>

        {/* Right: Palette trigger & Submit button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setPaletteOpen(!paletteOpen)}
            className="btn btn-secondary"
            style={{ padding: '8px 12px', fontSize: '13px' }}
          >
            <Menu size={16} /> Question Palette
          </button>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="btn btn-primary"
            style={{ backgroundColor: 'var(--color-success)', padding: '8px 18px', fontSize: '13px' }}
          >
            <Send size={15} /> Submit Test
          </button>
        </div>
      </header>

      {/* Main Exam Body */}
      <div style={{ flex: 1, display: 'flex', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        {/* Left: Active Question Area */}
        <div style={{ flex: 1, padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Question Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-teal-700)' }}>
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                <span className="status-chip status-notStarted" style={{ fontSize: '11px' }}>
                  ID: {currentQ?.id}
                </span>
              </div>

              {/* Autosave status indicator */}
              <div style={{ fontSize: '12px', color: saving ? 'var(--color-warning)' : 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} />
                <span>{saving ? 'Saving…' : 'Autosaved'}</span>
              </div>
            </div>

            {/* Question Text */}
            <div style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--color-ink-900)',
              lineHeight: 1.5,
              marginBottom: '28px',
              backgroundColor: 'var(--color-white)',
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-line)'
            }}>
              {currentQ?.question}
            </div>

            {/* Answer Options (A, B, C, D) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentQ?.options?.map((opt) => {
                const isSelected = currentAnswer.selectedOption === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectOption(opt.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px 20px',
                      borderRadius: 'var(--radius-sm)',
                      border: '2px solid',
                      borderColor: isSelected ? 'var(--color-teal-700)' : 'var(--color-line)',
                      backgroundColor: isSelected ? 'var(--color-teal-50)' : 'var(--color-white)',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '14px',
                      backgroundColor: isSelected ? 'var(--color-teal-700)' : 'var(--color-paper-100)',
                      color: isSelected ? 'var(--color-white)' : 'var(--color-ink-900)',
                      flexShrink: 0
                    }}>
                      {opt.key}
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: isSelected ? 700 : 500, color: 'var(--color-ink-900)' }}>
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '36px',
            paddingTop: '20px',
            borderTop: '1px solid var(--color-line)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleToggleReview}
                className="btn btn-secondary"
                style={{
                  backgroundColor: currentAnswer.markedForReview ? 'var(--color-saffron-100)' : 'var(--color-white)',
                  color: currentAnswer.markedForReview ? 'var(--color-warning)' : 'var(--color-ink-700)',
                  borderColor: currentAnswer.markedForReview ? 'var(--color-saffron-500)' : 'var(--color-line)'
                }}
              >
                <Bookmark size={16} />
                {currentAnswer.markedForReview ? 'Marked for Review' : 'Mark for Review'}
              </button>

              {currentAnswer.selectedOption && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="btn btn-ghost"
                  style={{ fontSize: '13px' }}
                >
                  <RotateCcw size={14} /> Clear Selection
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="btn btn-secondary"
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <button
                type="button"
                onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                disabled={currentIndex === totalQuestions - 1}
                className="btn btn-primary"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Question Palette (Collapsible / Drawer) */}
        <aside style={{
          width: '320px',
          backgroundColor: 'var(--color-white)',
          borderLeft: '1px solid var(--color-line)',
          padding: '24px 20px',
          display: paletteOpen ? 'block' : 'none',
          position: 'sticky',
          top: '64px',
          height: 'calc(100vh - 64px)',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Question Palette</h3>
            <button onClick={() => setPaletteOpen(false)} style={{ color: 'var(--color-muted)' }}>
              <X size={18} />
            </button>
          </div>

          {/* Accessible Legend */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            fontSize: '11px',
            fontWeight: 600,
            marginBottom: '20px',
            padding: '12px',
            backgroundColor: 'var(--color-paper-50)',
            borderRadius: 'var(--radius-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--color-teal-700)' }}></span>
              <span>Answered</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--color-paper-100)', border: '1px solid var(--color-line)' }}></span>
              <span>Not Answered</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--color-saffron-500)' }}></span>
              <span>Review</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--color-coral-500)' }}></span>
              <span>Answered + Rev</span>
            </div>
          </div>

          {/* Grid of Numbered Tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
            {questions.map((q, idx) => {
              const ans = answers[q.id];
              const isCurrent = currentIndex === idx;
              const hasAnswer = Boolean(ans?.selectedOption);
              const isMarked = Boolean(ans?.markedForReview);

              let bgColor = 'var(--color-paper-100)';
              let textColor = 'var(--color-ink-900)';
              let borderColor = 'var(--color-line)';

              if (hasAnswer && isMarked) {
                bgColor = 'var(--color-coral-500)';
                textColor = 'var(--color-white)';
              } else if (isMarked) {
                bgColor = 'var(--color-saffron-500)';
                textColor = 'var(--color-white)';
              } else if (hasAnswer) {
                bgColor = 'var(--color-teal-700)';
                textColor = 'var(--color-white)';
              }

              if (isCurrent) {
                borderColor = 'var(--color-ink-900)';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    height: '38px',
                    borderRadius: 'var(--radius-sm)',
                    border: isCurrent ? '2px solid var(--color-ink-900)' : `1px solid ${borderColor}`,
                    backgroundColor: bgColor,
                    color: textColor,
                    fontWeight: 800,
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isCurrent ? '0 0 0 2px var(--color-teal-100)' : 'none'
                  }}
                  title={`Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(23, 38, 51, 0.6)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>
              Confirm Test Submission
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-ink-700)', marginBottom: '20px' }}>
              Once submitted, your answers will be evaluated server-side and detailed explanations will be revealed.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              padding: '16px',
              backgroundColor: 'var(--color-paper-50)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-teal-700)' }}>{answeredCount}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>Answered</div>
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-saffron-500)' }}>{markedCount}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>For Review</div>
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-danger)' }}>{unansweredCount}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>Unanswered</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="btn btn-secondary"
                disabled={submitting}
              >
                Return to Exam
              </button>
              <button
                type="button"
                onClick={handleManualSubmit}
                className="btn btn-primary"
                disabled={submitting}
                style={{ backgroundColor: 'var(--color-success)' }}
              >
                {submitting ? 'Evaluating Answers…' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

