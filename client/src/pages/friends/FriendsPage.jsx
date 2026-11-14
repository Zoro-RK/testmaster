import React, { useState, useEffect } from 'react';
import { Search, Users, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import FriendCard from '../../components/common/FriendCard';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function FriendsPage() {
  const { group } = useAuth();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      try {
        setLoading(true);
        const res = await api.getMembers(search);
        setMembers(res.members || []);
      } catch (err) {
        console.error('Failed to load friends:', err);
      } finally {
        setLoading(false);
      }
    }
    const timer = setTimeout(loadMembers, 200);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Study Circle Friends</h1>
          <p className="page-subtitle">
            See the portions covered by your friends and browse tests they have contributed.
          </p>
        </div>

        {/* Friends Count Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          backgroundColor: 'var(--color-white)',
          border: '1px solid var(--color-line)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '13px',
          color: 'var(--color-teal-700)',
          fontWeight: 600
        }}>
          <Users size={16} /> {members.length} Connected Friends
        </div>
      </div>

      {/* Privacy Guarantee Note */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: 'var(--color-paper-100)',
        border: '1px solid var(--color-line)',
        padding: '12px 18px',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '24px',
        fontSize: '13px',
        color: 'var(--color-ink-700)'
      }}>
        <ShieldCheck size={20} color="var(--color-teal-700)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Privacy Guarantee:</strong> You only see the syllabus portion statuses your friends have covered. Test scores, personal attempt answers, and personal study notes remain strictly private to each candidate.
        </span>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', maxWidth: '420px', marginBottom: '28px' }}>
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: '38px' }}
          placeholder="Search friends by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search size={16} color="var(--color-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
      </div>

      {/* Friends Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-muted)' }}>
          Loading circle members…
        </div>
      ) : members.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Users size={40} color="var(--color-muted)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>No members found</h3>
          <p style={{ fontSize: '14px', color: 'var(--color-muted)', marginTop: '4px' }}>
            {search ? 'Try adjusting your search query.' : 'Registered candidates automatically connect as friends in this circle.'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {members.map(member => (
            <FriendCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}

