import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  Circle, 
  List, 
  GitCommit, 
  Edit3, 
  Check, 
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function PortionPath({ 
  unit, 
  portions = [], 
  onUpdateStatus = null, 
  isEditable = false 
}) {
  const [viewMode, setViewMode] = useState('path'); // 'path' or 'list'
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [notes, setNotes] = useState('');

  const topics = unit?.topics || [];

  const getTopicProgress = (topicId) => {
    return portions.find(p => String(p.topicId) === String(topicId)) || { status: 'notStarted' };
  };

  const statusIcons = {
    notStarted: <Circle size={18} color="var(--color-muted)" strokeWidth={1.8} />,
    inProgress: <Clock size={18} color="var(--color-warning)" strokeWidth={2.2} />,
    completed: <CheckCircle2 size={18} color="var(--color-success)" strokeWidth={2.4} />,
    revisionNeeded: <RotateCcw size={18} color="var(--color-coral-500)" strokeWidth={2.2} />
  };

  const statusLabels = {
    notStarted: 'Not started',
    inProgress: 'In progress',
    completed: 'Completed',
    revisionNeeded: 'Revision needed'
  };

  const handleStartEdit = (topic, currentProgress) => {
    if (!isEditable) return;
    setEditingTopicId(topic.id);
    setSelectedStatus(currentProgress.status || 'notStarted');
    setNotes(currentProgress.privateNotes || '');
  };

  const handleSave = async (topicId) => {
    if (onUpdateStatus) {
      await onUpdateStatus(topicId, selectedStatus, notes);
    }
    setEditingTopicId(null);
  };

  return (
    <div className="portion-unit-card" style={{
      backgroundColor: 'var(--color-white)',
      border: '1px solid var(--color-line)',
      borderRadius: 'var(--radius-md)',
      padding: '24px',
      marginBottom: '24px'
    }}>
      {/* Unit Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--color-line)',
        paddingBottom: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, color: 'var(--color-teal-700)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {unit.code}
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-ink-900)' }}>
            {unit.name}
          </h3>
          <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '2px' }}>
            {topics.length} Syllabus Topics • Official Weightage: {unit.questionWeightage || '5'} Questions
          </div>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'inline-flex', backgroundColor: 'var(--color-paper-100)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
          <button
            onClick={() => setViewMode('path')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: viewMode === 'path' ? 'var(--color-white)' : 'transparent',
              color: viewMode === 'path' ? 'var(--color-teal-700)' : 'var(--color-ink-700)',
              boxShadow: viewMode === 'path' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <GitCommit size={14} />
            Visual Path
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: viewMode === 'list' ? 'var(--color-white)' : 'transparent',
              color: viewMode === 'list' ? 'var(--color-teal-700)' : 'var(--color-ink-700)',
              boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <List size={14} />
            List View
          </button>
        </div>
      </div>

      {/* Visual Portion Path or List View */}
      {viewMode === 'path' ? (
        <div className="portion-path-flow" style={{ position: 'relative', paddingLeft: '32px' }}>
          {/* Vertical connecting line */}
          <div style={{
            position: 'absolute',
            left: '11px',
            top: '16px',
            bottom: '24px',
            width: '2px',
            backgroundColor: 'var(--color-line-dark)',
            zIndex: 0
          }} />

          {topics.map((topic, index) => {
            const prog = getTopicProgress(topic.id);
            const isEditing = editingTopicId === topic.id;

            return (
              <div 
                key={topic.id}
                style={{
                  position: 'relative',
                  marginBottom: index === topics.length - 1 ? 0 : '24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}
              >
                {/* Node icon along the path line */}
                <div style={{
                  position: 'absolute',
                  left: '-32px',
                  top: '2px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1
                }}>
                  {statusIcons[prog.status] || statusIcons.notStarted}
                </div>

                {/* Content Box */}
                <div style={{
                  flex: 1,
                  backgroundColor: isEditing ? 'var(--color-paper-50)' : 'var(--color-white)',
                  border: '1px solid',
                  borderColor: isEditing ? 'var(--color-teal-700)' : 'var(--color-line)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px 18px',
                  transition: 'all 0.15s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-ink-900)' }}>
                        {topic.name}
                      </div>
                      {topic.nameTa && topic.nameTa !== topic.name && (
                        <div className="ta-text" style={{ fontSize: '13px', color: 'var(--color-ink-700)', marginTop: '2px' }}>
                          {topic.nameTa}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className={`status-chip status-${prog.status}`}>
                        {statusIcons[prog.status]}
                        <span>{statusLabels[prog.status]}</span>
                      </span>

                      {isEditable && !isEditing && (
                        <button
                          onClick={() => handleStartEdit(topic, prog)}
                          className="btn btn-ghost"
                          style={{ padding: '6px 10px', fontSize: '12px' }}
                          title="Update Status"
                        >
                          <Edit3 size={14} />
                          Update
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Private notes preview (owner only) */}
                  {prog.privateNotes && !isEditing && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--color-muted)', backgroundColor: 'var(--color-paper-50)', padding: '6px 10px', borderRadius: '4px' }}>
                      <strong>Private Note:</strong> {prog.privateNotes}
                    </div>
                  )}

                  {/* Inline Edit Form */}
                  {isEditing && (
                    <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--color-line)' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '8px', color: 'var(--color-ink-700)' }}>
                        Select Preparation Status:
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        {['notStarted', 'inProgress', 'completed', 'revisionNeeded'].map(st => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setSelectedStatus(st)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 'var(--radius-pill)',
                              fontSize: '12px',
                              fontWeight: 600,
                              border: '1px solid',
                              borderColor: selectedStatus === st ? 'var(--color-teal-700)' : 'var(--color-line)',
                              backgroundColor: selectedStatus === st ? 'var(--color-teal-100)' : 'var(--color-white)',
                              color: selectedStatus === st ? 'var(--color-teal-700)' : 'var(--color-ink-700)'
                            }}
                          >
                            {statusLabels[st]}
                          </button>
                        ))}
                      </div>

                      <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label className="form-label" style={{ fontSize: '12px' }}>Personal Private Notes (Only visible to you)</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ fontSize: '13px', padding: '8px 12px' }}
                          placeholder="Key formulas, books referenced, or notes to self..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => setEditingTopicId(null)}
                          className="btn btn-ghost"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSave(topic.id)}
                          className="btn btn-primary"
                          style={{ padding: '6px 14px', fontSize: '12px' }}
                        >
                          <Check size={14} />
                          Save Status
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Accessible List View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {topics.map((topic) => {
            const prog = getTopicProgress(topic.id);
            const isEditing = editingTopicId === topic.id;

            return (
              <div 
                key={topic.id}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-line)',
                  backgroundColor: 'var(--color-white)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-ink-900)' }}>
                    {topic.name}
                  </div>
                  {topic.nameTa && topic.nameTa !== topic.name && (
                    <div className="ta-text" style={{ fontSize: '12px', color: 'var(--color-ink-700)' }}>
                      {topic.nameTa}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`status-chip status-${prog.status}`}>
                    {statusIcons[prog.status]}
                    <span>{statusLabels[prog.status]}</span>
                  </span>

                  {isEditable && (
                    <button
                      onClick={() => handleStartEdit(topic, prog)}
                      className="btn btn-ghost"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .portion-unit-card {
            padding: 14px 12px !important;
          }
          .portion-path-flow {
            padding-left: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}

