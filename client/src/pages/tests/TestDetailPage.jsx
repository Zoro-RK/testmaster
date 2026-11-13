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
  FileText,
  BookOpen,
  Download,
  Eye,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FolderDown,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';
import PortionPdfModal from '../../components/tests/PortionPdfModal';

export default function TestDetailPage() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [availableTests, setAvailableTests] = useState([]);
  const [starting, setStarting] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [showInlinePdf, setShowInlinePdf] = useState(false);
  const [showSynopsis, setShowSynopsis] = useState(false);

  useEffect(() => {
    async function loadTest() {
      try {
        setLoading(true);
        setLoadError(null);
        const res = await api.getTestById(testId);
        setTestData(res.test);
      } catch (err) {
        console.error('Failed to load test details:', err);
        setLoadError(err.message || 'Test not found.');
        try {
          const listRes = await api.getTests();
          if (listRes && listRes.tests) {
            setAvailableTests(listRes.tests);
          }
        } catch (e) {
          // ignore
        }
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

  if (loading) return <LoadingScreen message="Loading test details and portion study guide…" />;

  if (!testData) {
    return (
      <div className="page-container" style={{ maxWidth: '880px' }}>
        <Link to="/tests" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '20px', color: 'var(--color-ink-700)' }}>
          <ArrowLeft size={16} /> Back to Test Library
        </Link>

        <div className="card" style={{ padding: '40px 32px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-paper-100)',
            color: 'var(--color-teal-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: '1px solid var(--color-line)'
          }}>
            <HelpCircle size={32} />
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-ink-900)' }}>
            Practice Test Not Found
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-muted)', maxWidth: '480px', margin: '8px auto 24px', lineHeight: 1.5 }}>
            {loadError || 'The practice test you requested could not be located in the current study circle library, or it may have been moved or archived.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/tests" className="btn btn-primary" style={{ padding: '10px 20px' }}>
              <BookOpen size={16} /> Browse Test Library
            </Link>
            <Link to="/tests/upload" className="btn btn-secondary" style={{ padding: '10px 20px' }}>
              Upload Practice Test
            </Link>
          </div>
        </div>

        {availableTests.length > 0 && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-ink-900)', marginBottom: '14px' }}>
              Available Practice Tests in Your Circle:
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {availableTests.slice(0, 4).map(t => (
                <div key={t.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span className="status-chip status-notStarted" style={{ fontSize: '11px', marginBottom: '8px' }}>
                      {t.partName || 'TNPSC General Studies'}
                    </span>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-ink-900)', marginTop: '4px' }}>
                      {t.title}
                    </h4>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '6px' }}>
                      {t.questionCount} Questions • {t.durationMinutes} Mins • {t.language}
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to={`/tests/${t.id}`} className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 14px' }}>
                      View & Study Portion <PlayCircle size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const token = localStorage.getItem('tnpsc_token');
  const rawPdfUrl = testData.portionPdfUrl || `/api/tests/${testId}/portion-pdf`;
  const pdfUrl = token ? `${rawPdfUrl}${rawPdfUrl.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}` : rawPdfUrl;
  const pdfName = testData.portionPdfName || 'Portion_Study_Guide.pdf';

  return (
    <div className="page-container" style={{ maxWidth: '880px' }}>
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
          margin: '24px 0',
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

        {/* ============================================================== */}
        {/* NEW FEATURE: STUDY PORTION PDF BEFORE ATTENDING THE MCQ        */}
        {/* ============================================================== */}
        <div style={{
          backgroundColor: 'var(--color-paper-100)',
          border: '1.5px solid var(--color-teal-700)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          marginBottom: '28px',
          boxShadow: '0 4px 14px rgba(23, 107, 103, 0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-teal-700)',
                color: 'var(--color-white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <BookOpen size={22} />
              </div>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'var(--color-teal-700)',
                  backgroundColor: 'var(--color-teal-100)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  <Sparkles size={12} />
                  Recommended Preparation
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-ink-900)' }}>
                  Study Portion Covered in this Test
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-ink-700)', marginTop: '2px' }}>
                  Review the study portion PDF before starting your timed MCQ exam.
                </p>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                className="btn btn-primary"
                style={{
                  padding: '9px 16px',
                  fontSize: '13px',
                  backgroundColor: 'var(--color-teal-700)',
                  boxShadow: '0 2px 8px rgba(23, 107, 103, 0.25)'
                }}
              >
                <BookOpen size={16} /> View & Study PDF
              </button>

              <a
                href={pdfUrl}
                download={pdfName}
                className="btn btn-secondary"
                style={{ padding: '9px 14px', fontSize: '13px' }}
                title="Download Portion PDF"
              >
                <Download size={15} /> Download PDF
              </a>

              <button
                type="button"
                onClick={() => setShowInlinePdf(!showInlinePdf)}
                className="btn btn-ghost"
                style={{ padding: '9px 12px', fontSize: '13px', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-line)' }}
              >
                <Eye size={15} /> {showInlinePdf ? 'Hide Inline' : 'Preview Inline'}
              </button>
            </div>
          </div>

          {/* Topics Covered Chips */}
          {testData.linkedTopics && testData.linkedTopics.length > 0 && (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-line)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-ink-700)', marginBottom: '8px' }}>
                Topics Included in this Portion:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {testData.linkedTopics.map(t => (
                  <span
                    key={t.id}
                    style={{
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: 'var(--color-white)',
                      border: '1px solid var(--color-line)',
                      color: 'var(--color-ink-900)',
                      fontWeight: 600
                    }}
                  >
                    • {t.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Expandable Key Concepts Synopsis */}
          {testData.portionKeyPoints && testData.portionKeyPoints.length > 0 && (
            <div style={{ marginTop: '14px' }}>
              <button
                type="button"
                onClick={() => setShowSynopsis(!showSynopsis)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--color-teal-700)',
                  padding: '4px 0'
                }}
              >
                {showSynopsis ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {showSynopsis ? 'Hide High-Yield Concept Summary' : 'Quick View High-Yield Concepts & Revision Notes'}
              </button>

              {showSynopsis && (
                <div style={{
                  marginTop: '10px',
                  padding: '16px',
                  backgroundColor: 'var(--color-white)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-line)',
                  fontSize: '13px',
                  color: 'var(--color-ink-900)'
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-teal-700)', marginBottom: '8px' }}>
                    Core Concepts to Remember for this Test:
                  </div>
                  <ul style={{ paddingLeft: '18px', lineHeight: 1.6 }}>
                    {testData.portionKeyPoints.map((pt, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Optional Inline PDF Viewer */}
          {showInlinePdf && (
            <div style={{
              marginTop: '18px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              border: '1px solid var(--color-line)',
              height: '520px',
              backgroundColor: '#525659'
            }}>
              <iframe
                src={`${pdfUrl}#toolbar=1`}
                title="Portion Study PDF Inline Preview"
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          )}

          {/* Linked Group Notes if any */}
          {testData.linkedMaterials && testData.linkedMaterials.length > 0 && (
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--color-ink-700)' }}>
              <strong>Circle Study Notes:</strong>{' '}
              {testData.linkedMaterials.map(m => (
                <a
                  key={m.id}
                  href={m.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ marginLeft: '6px', color: 'var(--color-teal-700)', textDecoration: 'underline' }}
                >
                  {m.title} ({m.fileName})
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Examination Instructions */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--color-ink-900)' }}>
            Examination Instructions:
          </h3>
          <ul style={{ paddingLeft: '20px', fontSize: '14px', color: 'var(--color-ink-700)', lineHeight: 1.7 }}>
            <li>Review the portion PDF above before initiating the examination.</li>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <button
            type="button"
            onClick={() => setIsPdfModalOpen(true)}
            className="btn btn-secondary"
            style={{ padding: '12px 20px', fontSize: '14px' }}
          >
            <BookOpen size={16} /> Open Portion PDF
          </button>

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

      {/* Interactive Fullscreen/Modal PDF Study Reader */}
      <PortionPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        pdfUrl={pdfUrl}
        pdfName={pdfName}
        title={testData.title}
        onStartExam={handleStartExam}
      />
    </div>
  );
}
