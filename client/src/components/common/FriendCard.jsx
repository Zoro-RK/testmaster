import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';

export default function FriendCard({ member }) {
  const { displayName, email, role, portionSummary, recentActivity, testsPublishedCount } = member;

  const completed = portionSummary?.completedCount || 0;
  const total = portionSummary?.totalTopics || 85;
  const percentage = portionSummary?.completionPercentage || 0;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Top: Avatar & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-teal-100)',
            color: 'var(--color-teal-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '16px'
          }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ink-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayName}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
              Circle Member
            </div>
          </div>
        </div>

        {/* Portion Summary */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            <span style={{ color: 'var(--color-ink-700)' }}>Portions Covered</span>
            <span style={{ color: 'var(--color-teal-700)', fontWeight: 700 }}>{completed} of {total} topics</span>
          </div>
          <div className="progress-bar-bg" style={{ height: '7px' }}>
            <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>

        {/* Recent Activity or stats */}
        <div style={{ fontSize: '12px', color: 'var(--color-ink-700)', backgroundColor: 'var(--color-paper-50)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Tests published:</span>
            <strong>{testsPublishedCount || 0}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span>In progress:</span>
            <strong>{portionSummary?.inProgressCount || 0} topics</strong>
          </div>
        </div>
      </div>

      {/* Action link */}
      <Link 
        to={`/friends/${member.id}`} 
        className="btn btn-secondary" 
        style={{ width: '100%', justifyContent: 'center', fontSize: '13px' }}
      >
        View Shared Portions <ArrowRight size={14} />
      </Link>
    </div>
  );
}

