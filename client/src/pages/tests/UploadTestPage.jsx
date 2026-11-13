import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  Save, 
  Send, 
  FileCode, 
  Copy, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  Trash2,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';

const SAMPLE_JSON = {
  schemaVersion: "1.0",
  title: "Indian Polity - Fundamental Rights Practice Test",
  exam: "TNPSC Group IV",
  part: "A",
  unit: "Indian Polity",
  topics: ["fundamental-rights"],
  questionCount: 3,
  durationMinutes: 10,
  language: "English",
  questions: [
    {
      id: "Q001",
      question: "Under which Article of the Indian Constitution is the 'Right to Equality before Law' guaranteed?",
      options: [
        { key: "A", text: "Article 14" },
        { key: "B", text: "Article 19" },
        { key: "C", text: "Article 21" },
        { key: "D", text: "Article 32" }
      ],
      correctAnswer: "A",
      explanation: "Article 14 ensures equality before law and equal protection of the laws.",
      difficulty: "easy"
    },
    {
      id: "Q002",
      question: "Which Constitutional Amendment added the words 'Socialist, Secular and Integrity' to the Preamble?",
      options: [
        { key: "A", text: "44th Amendment Act" },
        { key: "B", text: "42nd Amendment Act" },
        { key: "C", text: "86th Amendment Act" },
        { key: "D", text: "73rd Amendment Act" }
      ],
      correctAnswer: "B",
      explanation: "The 42nd Amendment Act of 1976 amended the Preamble.",
      difficulty: "medium"
    },
    {
      id: "Q003",
      question: "Who called Article 32 the 'Heart and Soul of the Constitution'?",
      options: [
        { key: "A", text: "Jawaharlal Nehru" },
        { key: "B", text: "Dr. B. R. Ambedkar" },
        { key: "C", text: "Mahatma Gandhi" },
        { key: "D", text: "Sardar Patel" }
      ],
      correctAnswer: "B",
      explanation: "Dr. B. R. Ambedkar described Constitutional Remedies (Article 32) as the heart and soul.",
      difficulty: "easy"
    }
  ]
};

export default function UploadTestPage() {
  const navigate = useNavigate();

  // Stepper state: 1: Choose File, 2: Validate, 3: Preview, 4: Publish Confirmation
  const [step, setStep] = useState(1);
  const [jsonText, setJsonText] = useState('');
  const [fileName, setFileName] = useState('');
  const [portionPdfFile, setPortionPdfFile] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedSample, setCopiedSample] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setJsonText(event.target.result);
    };
    reader.readAsText(file);
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Please select a valid PDF file for the portion study material.');
      return;
    }
    setErrorMsg('');
    setPortionPdfFile(file);
  };

  const handleRemovePdf = () => {
    setPortionPdfFile(null);
  };

  const loadSample = () => {
    setJsonText(JSON.stringify(SAMPLE_JSON, null, 2));
    setFileName('sample_polity_test.json');
  };

  const handleValidate = async () => {
    setErrorMsg('');
    if (!jsonText.trim()) {
      setErrorMsg('Please select a JSON file or paste question data.');
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (err) {
      setErrorMsg('Invalid JSON syntax: ' + err.message);
      return;
    }

    try {
      setLoading(true);
      const res = await api.validateTestJson(parsed);
      setValidationResult(res);
      setParsedData(parsed);
      if (res.isValid) {
        setStep(3); // Jump to preview
      } else {
        setStep(2); // Show errors
      }
    } catch (err) {
      setErrorMsg('Validation request failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      await api.createTest({ ...parsedData, status: 'draft' }, portionPdfFile);
      navigate('/tests/my');
    } catch (err) {
      setErrorMsg('Failed to save draft: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      setLoading(true);
      await api.createTest({ ...parsedData, status: 'published' }, portionPdfFile);
      navigate('/tests');
    } catch (err) {
      setErrorMsg('Failed to publish test: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '960px' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Upload Practice Test</h1>
          <p className="page-subtitle">
            Import externally prepared questions (ChatGPT / JSON Schema v1.0) into the study circle library.
          </p>
        </div>

        <Link to="/tests" className="btn btn-ghost">
          <ArrowLeft size={16} /> Cancel
        </Link>
      </div>

      {/* 4-Step Stepper Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--color-line)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 24px',
        marginBottom: '28px',
        overflowX: 'auto'
      }}>
        {[
          { num: 1, label: '1. Select JSON' },
          { num: 2, label: '2. Validate' },
          { num: 3, label: '3. Preview' },
          { num: 4, label: '4. Publish' }
        ].map((s) => {
          const isDone = step > s.num;
          const isCurrent = step === s.num;
          return (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isCurrent ? 'var(--color-teal-700)' : isDone ? 'var(--color-success)' : 'var(--color-muted)', fontWeight: isCurrent ? 800 : 600, fontSize: '13px' }}>
              <span style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isCurrent ? 'var(--color-teal-700)' : isDone ? 'var(--color-success)' : 'var(--color-paper-200)',
                color: 'var(--color-white)',
                fontSize: '11px',
                fontWeight: 800
              }}>
                {isDone ? <Check size={14} /> : s.num}
              </span>
              <span>{s.label}</span>
            </div>
          );
        })}
      </div>

      {errorMsg && (
        <div style={{
          backgroundColor: 'var(--color-danger-light)',
          border: '1px solid #f5c2c2',
          color: 'var(--color-danger)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '13px',
          marginBottom: '20px'
        }}>
          {errorMsg}
        </div>
      )}

      {/* STEP 1: Select JSON File */}
      {step === 1 && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Choose JSON Question File</h3>
            <button
              onClick={loadSample}
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              <FileCode size={14} /> Load Standard Sample Test
            </button>
          </div>

          <div style={{
            border: '2px dashed var(--color-line-dark)',
            borderRadius: 'var(--radius-md)',
            padding: '36px 20px',
            textAlign: 'center',
            backgroundColor: 'var(--color-paper-50)',
            marginBottom: '20px'
          }}>
            <UploadCloud size={44} color="var(--color-teal-700)" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-ink-900)' }}>
              {fileName ? fileName : 'Drag & drop JSON file here, or click to browse'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px' }}>
              Requires structured schemaVersion "1.0" with 4 options per question
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              style={{ marginTop: '16px', fontSize: '13px' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Or Paste JSON Data Directly:</label>
            <textarea
              className="form-textarea"
              rows={10}
              style={{ fontFamily: 'monospace', fontSize: '12px' }}
              placeholder='Paste JSON here...'
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
            />
          </div>

          {/* Cover Portion Study Material (PDF) Upload */}
          <div style={{
            marginTop: '28px',
            paddingTop: '24px',
            borderTop: '1px solid var(--color-line)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-teal-100)',
                  color: 'var(--color-teal-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <BookOpen size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-ink-900)' }}>
                      Upload Cover Portion Study Material (PDF)
                    </h4>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--color-teal-700)',
                      backgroundColor: 'var(--color-teal-50)',
                      border: '1px solid var(--color-teal-200)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)'
                    }}>
                      Pre-Exam Study Guide
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '2px' }}>
                    Upload notes or portion PDF covering the questions. Aspirants can view and study this material before attempting the MCQs.
                  </p>
                </div>
              </div>
            </div>

            {portionPdfFile ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                backgroundColor: 'var(--color-paper-50)',
                border: '1.5px solid var(--color-teal-700)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-teal-700)',
                    color: 'var(--color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-ink-900)' }}>
                      {portionPdfFile.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '2px' }}>
                      Size: {(portionPdfFile.size / 1024).toFixed(1)} KB • Attached as Cover Portion Study Material
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 12px', cursor: 'pointer' }}>
                    Change PDF
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemovePdf}
                    className="btn btn-ghost"
                    style={{ fontSize: '12px', color: 'var(--color-danger)', padding: '6px 10px' }}
                    title="Remove attached PDF"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                border: '2px dashed var(--color-line-dark)',
                borderRadius: 'var(--radius-md)',
                padding: '24px 20px',
                textAlign: 'center',
                backgroundColor: 'var(--color-paper-50)'
              }}>
                <UploadCloud size={36} color="var(--color-teal-700)" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-ink-900)' }}>
                  Attach Cover Portion PDF (Optional / Recommended)
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px', maxWidth: '480px', margin: '4px auto 14px' }}>
                  Upload Samacheer Kalvi / TNPSC study guide PDF covering the questions.
                  If omitted, an official syllabus portion guide will be auto-generated.
                </div>
                <label className="btn btn-secondary" style={{ fontSize: '13px', padding: '7px 16px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={15} /> Choose Portion PDF
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={handleValidate}
              className="btn btn-primary"
              disabled={loading || !jsonText.trim()}
            >
              {loading ? 'Validating…' : 'Validate File Structure'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Validation Errors View */}
      {step === 2 && validationResult && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <XCircle size={28} color="var(--color-danger)" />
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-danger)' }}>
                Validation Found {validationResult.errors.length} Error(s)
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-muted)' }}>
                Please resolve the structural discrepancies below before saving this test.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {validationResult.errors.map((err, i) => (
              <div key={i} style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-danger-light)', border: '1px solid #f2c7c7', fontSize: '13px', color: 'var(--color-danger)' }}>
                <strong>{err.field}:</strong> {err.message}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              onClick={() => setStep(1)}
              className="btn btn-primary"
            >
              <ArrowLeft size={16} /> Return & Fix File
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Preview Questions */}
      {step === 3 && parsedData && (
        <div>
          {/* Summary Banner */}
          <div className="card" style={{ padding: '24px', marginBottom: '24px', backgroundColor: 'var(--color-white)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-success)', marginBottom: '12px' }}>
              <CheckCircle2 size={20} />
              <strong style={{ fontSize: '15px' }}>Validation Passed: Schema v1.0 Valid</strong>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 800 }}>{parsedData.title}</h2>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--color-muted)', marginTop: '8px' }}>
              <span>{parsedData.questions?.length} Questions</span>
              <span>•</span>
              <span>Suggested: {parsedData.durationMinutes} Minutes</span>
              <span>•</span>
              <span>Medium: {parsedData.language || 'English'}</span>
            </div>

            {/* Attached Portion Material Indicator in Preview */}
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: portionPdfFile ? 'var(--color-teal-50)' : 'var(--color-paper-100)',
              border: `1px solid ${portionPdfFile ? 'var(--color-teal-200)' : 'var(--color-line)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={18} color="var(--color-teal-700)" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ink-900)' }}>
                    {portionPdfFile ? `Attached Portion PDF: ${portionPdfFile.name}` : 'TNPSC Portion Study Guide: Auto-compiled'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
                    {portionPdfFile
                      ? `${(portionPdfFile.size / 1024).toFixed(1)} KB • Candidates can read this PDF before starting the MCQs`
                      : 'Candidates will receive a syllabus portion guide before starting the MCQs'}
                  </div>
                </div>
              </div>
              <span className="status-chip status-completed" style={{ fontSize: '11px' }}>
                Pre-Exam Guide Ready
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setStep(1)}
                className="btn btn-secondary"
                style={{ fontSize: '13px' }}
              >
                <ArrowLeft size={14} /> Back to Edit
              </button>
              <button
                onClick={handleSaveDraft}
                className="btn btn-secondary"
                disabled={loading}
                style={{ fontSize: '13px' }}
              >
                <Save size={14} /> Save as Draft
              </button>
              <button
                onClick={() => setStep(4)}
                className="btn btn-primary"
                style={{ fontSize: '13px' }}
              >
                Proceed to Publish <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Question List Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {parsedData.questions?.map((q, idx) => (
              <div key={q.id || idx} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-teal-700)' }}>
                    Question {idx + 1} ({q.id})
                  </span>
                  <span className="status-chip status-notStarted" style={{ fontSize: '11px' }}>
                    {q.difficulty || 'Medium'}
                  </span>
                </div>

                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-ink-900)', marginBottom: '14px', lineHeight: 1.4 }}>
                  {q.question}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginBottom: '14px' }}>
                  {q.options?.map((opt) => {
                    const isCorrect = opt.key === q.correctAnswer;
                    return (
                      <div
                        key={opt.key}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid',
                          borderColor: isCorrect ? 'var(--color-success)' : 'var(--color-line)',
                          backgroundColor: isCorrect ? 'var(--color-success-light)' : 'var(--color-white)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '13px'
                        }}
                      >
                        <span style={{ fontWeight: 800, color: isCorrect ? 'var(--color-success)' : 'var(--color-ink-700)' }}>
                          {opt.key}.
                        </span>
                        <span style={{ flex: 1 }}>{opt.text}</span>
                        {isCorrect && <Check size={14} color="var(--color-success)" />}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div style={{ fontSize: '12px', color: 'var(--color-ink-700)', backgroundColor: 'var(--color-paper-100)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: Publish Confirmation */}
      {step === 4 && parsedData && (
        <div className="card" style={{ padding: '36px 32px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--color-teal-100)', color: 'var(--color-teal-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Send size={28} />
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Ready to Publish to Group Library?</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-ink-700)', maxWidth: '520px', margin: '8px auto 24px', lineHeight: 1.5 }}>
            Publishing makes <strong>"{parsedData.title}"</strong> available for all circle friends to attempt. An immutable version snapshot will be saved.
          </p>

          <div style={{
            maxWidth: '420px',
            margin: '0 auto 28px',
            padding: '16px',
            backgroundColor: 'var(--color-paper-50)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-line)',
            textAlign: 'left',
            fontSize: '13px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span style={{ color: 'var(--color-muted)' }}>Question Count:</span>
              <strong>{parsedData.questions?.length} Questions</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span style={{ color: 'var(--color-muted)' }}>Suggested Duration:</span>
              <strong>{parsedData.durationMinutes} Minutes</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span style={{ color: 'var(--color-muted)' }}>Language:</span>
              <strong>{parsedData.language || 'English'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderTop: '1px dashed var(--color-line)', marginTop: '4px', paddingTop: '4px' }}>
              <span style={{ color: 'var(--color-muted)' }}>Study Portion PDF:</span>
              <strong style={{ color: 'var(--color-teal-700)' }}>
                {portionPdfFile ? portionPdfFile.name : 'Auto-compiled Syllabus PDF'}
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
            <button
              onClick={() => setStep(3)}
              className="btn btn-secondary"
              disabled={loading}
            >
              Back to Preview
            </button>
            <button
              onClick={handlePublish}
              className="btn btn-primary"
              disabled={loading}
              style={{ padding: '12px 24px' }}
            >
              {loading ? 'Publishing…' : 'Publish to Group Test Library'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

