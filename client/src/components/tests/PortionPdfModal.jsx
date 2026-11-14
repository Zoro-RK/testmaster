import React, { useState } from 'react';
import { X, Download, ExternalLink, BookOpen, Printer, CheckCircle, Maximize2, Minimize2 } from 'lucide-react';

export default function PortionPdfModal({ isOpen, onClose, pdfUrl, pdfName, title, onStartExam }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  const token = localStorage.getItem('tnpsc_token');
  const resolvedPdfUrl = (token && !pdfUrl.includes('token='))
    ? `${pdfUrl}${pdfUrl.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`
    : pdfUrl;

  return (
    <div className="portion-modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(23, 38, 51, 0.75)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isFullscreen ? 0 : '16px',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)'
    }}>
      <div className="portion-modal-dialog" style={{
        backgroundColor: 'var(--color-white)',
        borderRadius: isFullscreen ? 0 : 'var(--radius-md)',
        width: isFullscreen ? '100vw' : '92vw',
        maxWidth: isFullscreen ? '100vw' : '1100px',
        height: isFullscreen ? '100vh' : '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-modal)',
        overflow: 'hidden'
      }}>
        {/* Header Bar */}
        <div style={{
          padding: '12px 16px',
          backgroundColor: 'var(--color-ink-900)',
          color: 'var(--color-white)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'var(--color-teal-700)',
              color: 'var(--color-white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <BookOpen size={18} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '11px', color: 'var(--color-saffron-500)', fontWeight: 700, textTransform: 'uppercase' }}>
                Portion Study Guide
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-white)', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {title}
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Download Link */}
            <a
              href={resolvedPdfUrl}
              download={pdfName}
              className="btn btn-secondary"
              style={{
                padding: '6px 10px',
                fontSize: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: 'var(--color-white)',
                borderColor: 'rgba(255, 255, 255, 0.25)'
              }}
              title="Download PDF"
            >
              <Download size={14} /> <span className="btn-label-desktop">PDF</span>
            </a>

            {/* Open in New Window */}
            <a
              href={resolvedPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={{
                padding: '6px 10px',
                fontSize: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: 'var(--color-white)',
                borderColor: 'rgba(255, 255, 255, 0.25)'
              }}
              title="Open full screen in browser tab"
            >
              <ExternalLink size={14} /> Open
            </a>

            {/* Toggle Fullscreen Modal */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="btn btn-ghost"
              style={{ color: 'var(--color-white)', padding: '6px' }}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="btn btn-ghost"
              style={{ color: 'var(--color-white)', padding: '6px' }}
              title="Close Guide"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div style={{ flex: 1, backgroundColor: '#525659', position: 'relative' }}>
          <iframe
            src={`${resolvedPdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
            title={`Portion Study Guide: ${title}`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block'
            }}
          />
        </div>

        {/* Bottom Action Footer */}
        <div style={{
          padding: '12px 16px',
          backgroundColor: 'var(--color-white)',
          borderTop: '1px solid var(--color-line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--color-ink-700)' }}>
            Finished reading? Start your timed MCQ test.
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%' }}>
            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: '13px', padding: '8px 12px' }}
            >
              Close
            </button>

            {onStartExam && (
              <button
                onClick={() => {
                  onClose();
                  onStartExam();
                }}
                className="btn btn-primary"
                style={{ flex: 1, fontSize: '13px', padding: '8px 16px', backgroundColor: 'var(--color-teal-700)' }}
              >
                <CheckCircle size={15} /> Start Examination
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .portion-modal-overlay {
            padding: 0 !important;
          }
          .portion-modal-dialog {
            width: 100vw !important;
            height: 100vh !important;
            border-radius: 0 !important;
            max-width: 100vw !important;
          }
        }
      `}</style>
    </div>
  );
}

