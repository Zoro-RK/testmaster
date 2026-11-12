import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  HelpCircle, 
  ShieldCheck, 
  PlayCircle, 
  RotateCcw, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { api } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function TestDetailPage() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    async function loadTest() {
      try {
        setLoading(true);
        const res = await api.getTestById(testId);
        setTestData(res.test);
      } catch (err) {
        console.error('Failed to load test details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTest();
  }, [testId]);

  const handleStartExam = async () => {
    try {
      setStarting(true);
      const res = await api.startAttempt(testId);
      navigate(`/exam/attempt/${res.attemptId}`);
    } catch (err) {
      alert('Failed to start test attempt: ' + err.message);
    } finally {
      setStarting(false);
    }
  };

  if (loading) return <LoadingScreen message="Loading test details and instructions…" />;
  if (!testData) return <div className="page-container">Test not found.</div>;

  return (
    <div className="page-container" style={{ maxWidth: '840px' }}>
      <Link to="/tests" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '20px', color: 'var(--color-ink-700)' }}>
        <ArrowLeft size={16} /> Back to Test Library
      </Link>

      <div className="card" style={{ padding: '36px' }}>
        {/* Header */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          <span className="status-chip status-notStarted">
            {testData.partName || 'TNPSC Practice Test'}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
            Contributed by {testData.creator?.displayName}
          </span>
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-ink-900)', lineHeight: 1.25 }}>
          {testData.title}
        </h1>

        {testData.description && (
          <p style={{ fontSize: '15px', color: 'var(--color-ink-700)', marginTop: '8px', lineHeight: 1.6 }}>
            {testData.description}
          </p>
        )}

        {/* Test Spec Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          margin: '28px 0',
          padding: '20px',
          backgroundColor: 'var(--color-paper-50)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-line)'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontWeight: 600 }}>Questions</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-ink-900)', marginTop: '2px' }}>
              {testData.questionCount} MCQs
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontWeight: 600 }}>Time Allowed</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-ink-900)', marginTop: '2px' }}>
              {testData.durationMinutes} Minutes
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontWeight: 600 }}>Medium / Language</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-ink-900)', marginTop: '2px' }}>
              {testData.language}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontWeight: 600 }}>Evaluation</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-success)', marginTop: '2px' }}>
              Server Evaluated
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--color-ink-900)' }}>
            Examination Instructions:
          </h3>
          <ul style={{ paddingLeft: '20px', fontSize: '14px', color: 'var(--color-ink-700)', lineHeight: 1.7 }}>
            <li>The timer starts as soon as you click <strong>Start Examination</strong>.</li>
            <li>Each question has exactly 4 options with one correct answer.</li>
            <li>You can mark questions for review and navigate using the Question Palette.</li>
            <li>Your answers are saved automatically as you select them.</li>
            <li>The test will automatically submit when the allotted time runs out.</li>
            <li><strong>Strict Privacy:</strong> Only you will be able to see your score and explanations. No friend rankings or leaderboards exist.</li>
          </ul>
        </div>

        {/* Previous Attempt Summary if exists */}
        {testData.latestAttempt && testData.latestAttempt.status === 'submitted' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            backgroundColor: 'var(--color-success-light)',
            border: '1px solid #c2e2d0',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-success)' }}>
                You previously completed this test
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-ink-700)', marginTop: '2px' }}>
                Your private score was {testData.latestAttempt.score} / {testData.questionCount}
              </div>
            </div>
            <Link to={`/exam/result/${testData.latestAttempt.id}`} className="btn btn-secondary" style={{ fontSize: '12px' }}>
              Review Past Explanations
            </Link>
          </div>
        )}

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px' }}>
          <button
            onClick={handleStartExam}
            className="btn btn-primary"
            disabled={starting}
            style={{ padding: '14px 32px', fontSize: '15px' }}
          >
            {starting ? 'Initiating Exam…' : (
              testData.latestAttempt?.status === 'inProgress' ? 'Resume Attempt' : 'Start Examination'
            )}
            <PlayCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

