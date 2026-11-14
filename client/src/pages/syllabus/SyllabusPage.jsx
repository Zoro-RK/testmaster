import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  BookOpen, 
  Award, 
  Compass, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function SyllabusPage() {
  const [syllabusData, setSyllabusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePart, setActivePart] = useState('A');
  const [expandedUnits, setExpandedUnits] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchSyllabus() {
      try {
        setLoading(true);
        const res = await api.getExamSyllabus('default');
        setSyllabusData(res);
        // Expand first unit by default
        if (res.parts?.[0]?.units?.[0]) {
          setExpandedUnits({ [res.parts[0].units[0].id]: true });
        }
      } catch (err) {
        console.error('Failed to load syllabus:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSyllabus();
  }, []);

  if (loading) return <LoadingScreen message="Loading TNPSC Group IV canonical syllabus…" />;
  if (!syllabusData) return <div className="page-container">Failed to load syllabus data.</div>;

  const { exam, parts = [] } = syllabusData;

  const toggleUnit = (unitId) => {
    setExpandedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const currentPart = parts.find(p => p.code === activePart) || parts[0];

  // Global search filtering
  const searchLower = search.trim().toLowerCase();
  const searchResults = [];
  if (searchLower) {
    parts.forEach(p => {
      p.units?.forEach(u => {
        u.topics?.forEach(t => {
          if (t.name.toLowerCase().includes(searchLower) || (t.nameTa && t.nameTa.toLowerCase().includes(searchLower))) {
            searchResults.push({ ...t, unitCode: u.code, unitName: u.name, partCode: p.code, partName: p.name });
          }
        });
      });
    });
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">TNPSC Group IV Syllabus Explorer</h1>
          <p className="page-subtitle">
            Official curriculum based on TNPSC Combined Civil Services Examination — IV notification.
          </p>
        </div>

        <Link to="/portions" className="btn btn-primary">
          <Compass size={16} />
          Go to My Portion Path
        </Link>
      </div>

      {/* Global Search Bar */}
      <div style={{ position: 'relative', maxWidth: '500px', marginBottom: '24px' }}>
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: '38px' }}
          placeholder="Search syllabus topics in English or தமிழ்…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search size={16} color="var(--color-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
      </div>

      {/* Search Results Display if searching */}
      {searchLower ? (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', color: 'var(--color-ink-900)' }}>
            Search Results for "{search}" ({searchResults.length} topics found):
          </div>

          {searchResults.length === 0 ? (
            <div className="card" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>
              No syllabus topics matched your search keyword.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {searchResults.map(t => (
                <Link
                  key={t.id}
                  to={`/syllabus/topics/${t.id}`}
                  className="card"
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'border-color 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--color-teal-700)', fontWeight: 600 }}>
                      Part {t.partCode} • {t.unitCode}: {t.unitName}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-ink-900)', marginTop: '2px' }}>
                      {t.name}
                    </div>
                    {t.nameTa && t.nameTa !== t.name && (
                      <div className="ta-text" style={{ fontSize: '13px', color: 'var(--color-ink-700)' }}>
                        {t.nameTa}
                      </div>
                    )}
                  </div>
                  <ArrowRight size={16} color="var(--color-muted)" />
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Part Tabs Navigation */
        <div>
          <div className="tabs-scroll-container" style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            borderBottom: '1px solid var(--color-line)',
            marginBottom: '20px',
            paddingBottom: '2px'
          }}>
            {parts.map(part => {
              const isActive = activePart === part.code;
              return (
                <button
                  key={part.code}
                  onClick={() => setActivePart(part.code)}
                  style={{
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                    borderBottom: '2px solid',
                    borderColor: isActive ? 'var(--color-teal-700)' : 'transparent',
                    color: isActive ? 'var(--color-teal-700)' : 'var(--color-ink-700)',
                    backgroundColor: isActive ? 'var(--color-white)' : 'transparent',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{part.name}</span>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: isActive ? 'var(--color-teal-100)' : 'var(--color-paper-100)',
                    color: isActive ? 'var(--color-teal-700)' : 'var(--color-muted)',
                    fontWeight: 800
                  }}>
                    {part.questionWeightage} Qs
                  </span>
                </button>
              );
            })}
          </div>

          {/* Current Part Overview */}
          {currentPart && (
            <div>
              <div style={{
                backgroundColor: 'var(--color-paper-100)',
                border: '1px solid var(--color-line)',
                padding: '16px 20px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800 }}>{currentPart.name}</h2>
                  <div style={{ fontSize: '13px', color: 'var(--color-ink-700)', marginTop: '2px' }}>
                    Language medium: <strong>{currentPart.language}</strong> • Total Units: <strong>{currentPart.unitsCount}</strong>
                  </div>
                </div>

                <div style={{
                  padding: '6px 14px',
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid var(--color-line)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--color-teal-700)'
                }}>
                  Weightage: {currentPart.questionWeightage} Questions
                </div>
              </div>

              {/* Units Accordion List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {currentPart.units?.map(unit => {
                  const isExpanded = Boolean(expandedUnits[unit.id]);
                  return (
                    <div 
                      key={unit.id} 
                      className="card" 
                      style={{ padding: 0, overflow: 'hidden' }}
                    >
                      {/* Unit Accordion Trigger */}
                      <button
                        onClick={() => toggleUnit(unit.id)}
                        style={{
                          width: '100%',
                          padding: '18px 24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          textAlign: 'left',
                          backgroundColor: isExpanded ? 'var(--color-paper-50)' : 'var(--color-white)',
                          borderBottom: isExpanded ? '1px solid var(--color-line)' : 'none',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--color-teal-100)',
                            color: 'var(--color-teal-700)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '13px'
                          }}>
                            {unit.code.replace('Unit ', 'U')}
                          </div>
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ink-900)' }}>
                              {unit.name}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '2px' }}>
                              {unit.topicsCount} Topics • {unit.questionWeightage ? `${unit.questionWeightage} Questions Weightage` : 'General Weightage'}
                            </div>
                          </div>
                        </div>

                        <div style={{ color: 'var(--color-muted)' }}>
                          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </div>
                      </button>

                      {/* Expanded Topics Table */}
                      {isExpanded && (
                        <div style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {unit.topics?.map((topic, idx) => (
                              <div
                                key={topic.id}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '10px 12px',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: idx % 2 === 0 ? 'var(--color-white)' : 'var(--color-paper-50)',
                                  border: '1px solid var(--color-line)'
                                }}
                              >
                                <div style={{ flex: 1, paddingRight: '12px' }}>
                                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ink-900)' }}>
                                    {topic.name}
                                  </div>
                                  {topic.nameTa && topic.nameTa !== topic.name && (
                                    <div className="ta-text" style={{ fontSize: '12px', color: 'var(--color-ink-700)', marginTop: '2px' }}>
                                      {topic.nameTa}
                                    </div>
                                  )}
                                </div>

                                <Link
                                  to={`/syllabus/topics/${topic.id}`}
                                  className="btn btn-ghost"
                                  style={{ padding: '4px 10px', fontSize: '12px', color: 'var(--color-teal-700)' }}
                                >
                                  Details <ArrowRight size={14} />
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

