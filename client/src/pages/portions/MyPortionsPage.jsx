import React, { useState, useEffect } from 'react';
import { Compass, Filter, CheckCircle2, Clock, RotateCcw, Circle } from 'lucide-react';
import { api } from '../../services/api';
import PortionPath from '../../components/syllabus/PortionPath';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function MyPortionsPage() {
  const [syllabus, setSyllabus] = useState(null);
  const [portions, setPortions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePartCode, setActivePartCode] = useState('A');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [sylRes, portionsRes] = await Promise.all([
          api.getExamSyllabus('default'),
          api.getMyPortions()
        ]);
        setSyllabus(sylRes);
        setPortions(portionsRes.portions || []);
      } catch (err) {
        console.error('Failed to load portions data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUpdateStatus = async (topicId, status, privateNotes) => {
    try {
      const res = await api.updateMyPortion(topicId, { status, privateNotes });
      setPortions(prev => {
        const idx = prev.findIndex(p => String(p.topicId) === String(topicId));
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = res.portion;
          return updated;
        }
        return [...prev, res.portion];
      });
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  if (loading) return <LoadingScreen message="Loading your portion tracking path…" />;
  if (!syllabus) return <div className="page-container">Failed to load syllabus.</div>;

  const currentPart = syllabus.parts?.find(p => p.code === activePartCode) || syllabus.parts?.[0];

  // Calculate statistics
  const totalTopics = syllabus.parts?.reduce((sum, p) => sum + (p.units?.reduce((uSum, u) => uSum + (u.topics?.length || 0), 0) || 0), 0) || 1;
  const completedCount = portions.filter(p => p.status === 'completed').length;
  const inProgressCount = portions.filter(p => p.status === 'inProgress').length;
  const revisionCount = portions.filter(p => p.status === 'revisionNeeded').length;
  const completionPercentage = Math.round((completedCount / totalTopics) * 100);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Portion Tracker</h1>
          <p className="page-subtitle">
            Update your syllabus coverage. Friends see your completed topics in their directory. Private notes remain confidential.
          </p>
        </div>

        {/* Overall Completion Percentage Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 18px',
          backgroundColor: 'var(--color-white)',
          border: '1px solid var(--color-line)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Overall Progress</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-teal-700)' }}>
              {completedCount} <span style={{ fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500 }}>/ {totalTopics} topics ({completionPercentage}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Part Selection Tabs */}
      <div className="tabs-scroll-container" style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        borderBottom: '1px solid var(--color-line)',
        marginBottom: '20px'
      }}>
        {syllabus.parts?.map(part => {
          const isActive = activePartCode === part.code;
          return (
            <button
              key={part.code}
              onClick={() => setActivePartCode(part.code)}
              style={{
                padding: '10px 18px',
                fontSize: '14px',
                fontWeight: 700,
                borderBottom: '2px solid',
                borderColor: isActive ? 'var(--color-teal-700)' : 'transparent',
                color: isActive ? 'var(--color-teal-700)' : 'var(--color-ink-700)',
                backgroundColor: isActive ? 'var(--color-white)' : 'transparent',
                borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                whiteSpace: 'nowrap'
              }}
            >
              {part.name}
            </button>
          );
        })}
      </div>

      {/* Filter Chips Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink-700)' }}>
          <Filter size={15} /> Filter:
        </div>

        {[
          { key: 'all', label: 'All Topics' },
          { key: 'completed', label: `Completed (${completedCount})` },
          { key: 'inProgress', label: `In Progress (${inProgressCount})` },
          { key: 'revisionNeeded', label: `Revision Needed (${revisionCount})` },
          { key: 'notStarted', label: 'Not Started' }
        ].map(flt => (
          <button
            key={flt.key}
            onClick={() => setStatusFilter(flt.key)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12px',
              fontWeight: 600,
              border: '1px solid',
              borderColor: statusFilter === flt.key ? 'var(--color-teal-700)' : 'var(--color-line)',
              backgroundColor: statusFilter === flt.key ? 'var(--color-teal-100)' : 'var(--color-white)',
              color: statusFilter === flt.key ? 'var(--color-teal-700)' : 'var(--color-ink-700)'
            }}
          >
            {flt.label}
          </button>
        ))}
      </div>

      {/* Portion Path Units List */}
      <div>
        {currentPart?.units?.map(unit => {
          // If filter is applied, filter topics in this unit
          let filteredTopics = unit.topics || [];
          if (statusFilter !== 'all') {
            filteredTopics = filteredTopics.filter(t => {
              const p = portions.find(item => String(item.topicId) === String(t.id));
              const currentStatus = p ? p.status : 'notStarted';
              return currentStatus === statusFilter;
            });
          }

          if (filteredTopics.length === 0 && statusFilter !== 'all') {
            return null; // hide unit if no matching topics
          }

          const unitWithFilteredTopics = {
            ...unit,
            topics: filteredTopics
          };

          return (
            <PortionPath
              key={unit.id}
              unit={unitWithFilteredTopics}
              portions={portions}
              onUpdateStatus={handleUpdateStatus}
              isEditable={true}
            />
          );
        })}
      </div>
    </div>
  );
}

