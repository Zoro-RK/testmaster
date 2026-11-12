import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CheckSquare, 
  FileText, 
  UploadCloud, 
  TrendingUp, 
  FolderDown, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Compass,
  Bookmark
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

export default function AppLayout({ children }) {
  const { user, group, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Friends', path: '/friends', icon: Users },
    { name: 'Syllabus', path: '/syllabus', icon: Compass },
    { name: 'My Portions', path: '/portions', icon: CheckSquare },
    { name: 'Test Library', path: '/tests', icon: FileText },
    { name: 'Upload Test', path: '/tests/upload', icon: UploadCloud },
    { name: 'My Progress', path: '/progress', icon: TrendingUp },
    { name: 'Study Materials', path: '/materials', icon: FolderDown }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-paper-50)' }}>
      {/* Desktop Fixed Sidebar */}
      <aside className="desktop-sidebar" style={{
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--color-white)',
        borderRight: '1px solid var(--color-line)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100
      }}>
        {/* Brand Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--color-line)' }}>
          <Logo variant="horizontal" size={32} />
          {group && (
            <div style={{
              marginTop: '12px',
              padding: '6px 10px',
              backgroundColor: 'var(--color-paper-100)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-ink-700)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-teal-700)' }}></span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{group.name}</span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 8px 8px 8px' }}>
            Preparation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '14px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--color-teal-700)' : 'var(--color-ink-700)',
                  backgroundColor: isActive ? 'var(--color-teal-100)' : 'transparent',
                  marginBottom: '4px',
                  position: 'relative',
                  transition: 'all 0.15s ease'
                }}
              >
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    top: '20%',
                    bottom: '20%',
                    width: '3.5px',
                    borderRadius: '0 4px 4px 0',
                    backgroundColor: 'var(--color-teal-700)'
                  }} />
                )}
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom User Profile & Sign Out */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--color-line)', backgroundColor: 'var(--color-paper-50)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-teal-700)',
              color: 'var(--color-white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '14px'
            }}>
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ink-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.displayName}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => navigate('/settings')}
              title="Settings"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-white)',
                border: '1px solid var(--color-line)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-ink-700)'
              }}
            >
              <Settings size={14} />
              Settings
            </button>
            <button
              onClick={handleLogout}
              title="Sign Out"
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-white)',
                border: '1px solid var(--color-line)',
                color: 'var(--color-danger)'
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="mobile-header" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--header-height)',
        backgroundColor: 'var(--color-white)',
        borderBottom: '1px solid var(--color-line)',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 90
      }}>
        <Logo variant="horizontal" size={28} />
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          style={{ padding: '8px', color: 'var(--color-ink-900)' }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(23, 38, 51, 0.4)',
          zIndex: 95,
          display: 'flex'
        }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{
            width: '80%',
            maxWidth: '300px',
            backgroundColor: 'var(--color-white)',
            height: '100%',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ marginBottom: '20px' }}>
              <Logo variant="horizontal" size={32} />
            </div>
            <nav style={{ flex: 1, overflowY: 'auto' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '15px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--color-teal-700)' : 'var(--color-ink-700)',
                      backgroundColor: isActive ? 'var(--color-teal-100)' : 'transparent',
                      marginBottom: '6px'
                    }}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div style={{ borderTop: '1px solid var(--color-line)', paddingTop: '16px' }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-danger)',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="main-content" style={{
        flex: 1,
        marginLeft: 'var(--sidebar-width)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ flex: 1 }}>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--mobile-nav-height)',
        backgroundColor: 'var(--color-white)',
        borderTop: '1px solid var(--color-line)',
        display: 'none',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 90,
        padding: '0 8px'
      }}>
        {[
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Syllabus', path: '/syllabus', icon: Compass },
          { name: 'Portions', path: '/portions', icon: CheckSquare },
          { name: 'Tests', path: '/tests', icon: FileText },
          { name: 'Progress', path: '/progress', icon: TrendingUp }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                color: isActive ? 'var(--color-teal-700)' : 'var(--color-muted)',
                fontSize: '11px',
                fontWeight: isActive ? 700 : 500
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <style>{`
        @media (max-width: 900px) {
          .desktop-sidebar {
            display: none !important;
          }
          .mobile-header {
            display: flex !important;
          }
          .mobile-bottom-nav {
            display: flex !important;
          }
          .main-content {
            margin-left: 0 !important;
            padding-top: var(--header-height);
            padding-bottom: var(--mobile-nav-height);
          }
        }
      `}</style>
    </div>
  );
}

