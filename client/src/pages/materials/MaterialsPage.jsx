import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FolderDown, 
  UploadCloud, 
  FileText, 
  Trash2, 
  Calendar, 
  User, 
  Check, 
  X, 
  BookOpen, 
  PlayCircle, 
  Sparkles,
  ArrowRight 
} from 'lucide-react';
import { api, BACKEND_URL } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';
import PortionPdfModal from '../../components/tests/PortionPdfModal';

export default function MaterialsPage() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activePdfModal, setActivePdfModal] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [textNotes, setTextNotes] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadMaterials();
  }, []);

  async function loadMaterials() {
    try {
      setLoading(true);
      const res = await api.getMaterials();
      setMaterials(res.materials || []);
    } catch (err) {
      console.error('Failed to load materials:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Title is required.');

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      if (file) {
        formData.append('file', file);
      } else if (textNotes.trim()) {
        formData.append('textNotes', textNotes.trim());
      } else {
        return alert('Please attach a file or type revision notes.');
      }

      await api.uploadMaterial(formData);
      setShowUploadModal(false);
      setTitle('');
      setDescription('');
      setTextNotes('');
      setFile(null);
      loadMaterials();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (materialId) => {
    if (!confirm('Are you sure you want to delete this study resource?')) return;
    try {
      await api.deleteMaterial(materialId);
      loadMaterials();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleOpenMaterial = (m) => {
    const token = localStorage.getItem('tnpsc_token');
    const rawPdfUrl = m.fileUrl.startsWith('http') 
      ? m.fileUrl 
      : (m.fileUrl.startsWith('/') ? `${BACKEND_URL}${m.fileUrl}` : `${BACKEND_URL}/uploads/${m.fileUrl}`);
    const resolvedPdfUrl = token 
      ? `${rawPdfUrl}${rawPdfUrl.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}` 
      : rawPdfUrl;

    setActivePdfModal({
      pdfUrl: resolvedPdfUrl,
      pdfName: m.fileName || 'Portion_Study_Material.pdf',
      title: m.title,
      testId: m.testId
    });
  };

  if (loading) return <LoadingScreen message="Loading shared study materials…" />;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Shared Study Materials</h1>
          <p className="page-subtitle">
            Curated notes, summaries, and revision PDF documents covering examination portions.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="btn btn-primary"
        >
          <UploadCloud size={16} /> Share Material
        </button>
      </div>

      {materials.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <FolderDown size={44} color="var(--color-muted)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>No study materials shared yet</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '4px' }}>
            Upload revision notes or publish a practice test with a portion guide to make materials available here.
          </p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn btn-primary"
            >
              <UploadCloud size={16} /> Share Material
            </button>
            <Link to="/tests/upload" className="btn btn-secondary">
              Upload Test with Portion Material
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px' }}>
          {materials.map(m => (
            <div key={m.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: 'var(--color-teal-100)', color: 'var(--color-teal-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <BookOpen size={18} />
                    </div>
                    <span className="status-chip status-notStarted" style={{ fontSize: '11px', padding: '2px 8px' }}>
                      {m.partName || (m.isPortionMaterial ? 'Portion Material' : 'Study Notes')}
                    </span>
                  </div>

                  {m.isOwner && (
                    <button
                      onClick={() => handleDelete(m.id)}
                      title="Delete material"
                      style={{ color: 'var(--color-muted)', padding: '4px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-ink-900)', lineHeight: 1.35 }}>
                  {m.title}
                </h3>
                {m.description && (
                  <p style={{ fontSize: '13px', color: 'var(--color-ink-700)', marginTop: '6px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {m.description}
                  </p>
                )}

                <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--color-line)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Uploaded by:</span>
                    <strong>{m.uploadedBy?.displayName || 'Demo'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span>Date:</span>
                    <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                  {m.questionCount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', color: 'var(--color-teal-700)', fontWeight: 600 }}>
                      <span>Practice Exam:</span>
                      <span>{m.questionCount} MCQs • {m.durationMinutes} Mins</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: View Material & Attend Test */}
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleOpenMaterial(m)}
                  className="btn btn-secondary"
                  style={{ flex: 1, minWidth: '120px', justifyContent: 'center', fontSize: '13px', padding: '8px 12px' }}
                >
                  <BookOpen size={14} /> View Material
                </button>

                <Link
                  to={m.testId ? `/tests/${m.testId}` : '/tests'}
                  className="btn btn-primary"
                  style={{ flex: 1, minWidth: '120px', justifyContent: 'center', fontSize: '13px', padding: '8px 12px', backgroundColor: 'var(--color-teal-700)' }}
                >
                  <PlayCircle size={15} /> Attend Test
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Study Guide Modal for Viewing Material */}
      {activePdfModal && (
        <PortionPdfModal
          isOpen={Boolean(activePdfModal)}
          onClose={() => setActivePdfModal(null)}
          pdfUrl={activePdfModal.pdfUrl}
          pdfName={activePdfModal.pdfName}
          title={activePdfModal.title}
          onStartExam={activePdfModal.testId ? () => {
            navigate(`/tests/${activePdfModal.testId}`);
          } : null}
        />
      )}

      {/* Upload Modal */}
      {showUploadModal && (
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
          <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Share Study Material</h3>
              <button onClick={() => setShowUploadModal(false)} style={{ color: 'var(--color-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit}>
              <div className="form-group">
                <label className="form-label">Material Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Indian Polity Writs & Articles Summary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Short overview of what is covered..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Attach File (PDF, DOCX, etc.)</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ fontSize: '13px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Or Write Quick Text Notes:</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Enter handwritten summary text or key points..."
                  value={textNotes}
                  onChange={(e) => setTextNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="btn btn-secondary"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploading}
                >
                  {uploading ? 'Sharing…' : 'Share Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

