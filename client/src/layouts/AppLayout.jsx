import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
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

  // Determine which single nav item is active based on the most specific (longest) matching path
  const activeNavItem = navItems
    .filter(item => location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path + '/')))
    .sort((a, b) => b.path.length - a.path.length)[0];

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
            const isActive = activeNavItem ? activeNavItem.path === item.path : location.pathname === item.path;
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
        height: 'calc(var(--header-height) + var(--safe-area-top))',
        paddingTop: 'var(--safe-area-top)',
        backgroundColor: 'var(--color-white)',
        borderBottom: '1px solid var(--color-line)',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '16px',
        paddingRight: '12px',
        zIndex: 90,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Logo variant="horizontal" size={26} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* User profile avatar thumbnail */}
          <button
            onClick={() => navigate('/settings')}
            aria-label="User Settings"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-teal-700)',
              color: 'var(--color-white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '13px'
            }}
          >
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
          </button>

          {/* Drawer menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-ink-900)',
              backgroundColor: mobileMenuOpen ? 'var(--color-paper-100)' : 'transparent'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(23, 38, 51, 0.5)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 99,
          display: 'flex'
        }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{
            width: '82%',
            maxWidth: '320px',
            backgroundColor: 'var(--color-white)',
            height: '100%',
            paddingTop: 'calc(var(--safe-area-top) + 16px)',
            paddingBottom: 'calc(var(--safe-area-bottom) + 16px)',
            paddingLeft: '16px',
            paddingRight: '16px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-modal)',
            animation: 'slideInLeft 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header with Close & Logo */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--color-line)' }}>
              <Logo variant="horizontal" size={28} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--color-paper-100)',
                  color: 'var(--color-ink-700)'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* User Profile Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              backgroundColor: 'var(--color-paper-50)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-line)',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-teal-700)',
                color: 'var(--color-white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '15px',
                flexShrink: 0
              }}>
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-ink-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.displayName}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email}
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 8px 8px 8px' }}>
                Preparation Sections
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNavItem ? activeNavItem.path === item.path : location.pathname === item.path;
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
                      fontSize: '14px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--color-teal-700)' : 'var(--color-ink-700)',
                      backgroundColor: isActive ? 'var(--color-teal-100)' : 'transparent',
                      marginBottom: '4px',
                      minHeight: '44px'
                    }}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Bottom Actions: Settings & Sign Out */}
            <div style={{ borderTop: '1px solid var(--color-line)', paddingTop: '14px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/settings');
                }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-paper-100)',
                  border: '1px solid var(--color-line)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-ink-700)',
                  minHeight: '44px'
                }}
              >
                <Settings size={16} />
                Settings
              </button>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid #f5c2c2',
                  color: 'var(--color-danger)',
                  fontWeight: 600,
                  fontSize: '13px',
                  minHeight: '44px'
                }}
              >
                <LogOut size={16} />
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
          {children || <Outlet />}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'calc(var(--mobile-nav-height) + var(--safe-area-bottom))',
        paddingBottom: 'var(--safe-area-bottom)',
        backgroundColor: 'var(--color-white)',
        borderTop: '1px solid var(--color-line)',
        display: 'none',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 90,
        paddingLeft: '4px',
        paddingRight: '4px',
        boxShadow: '0 -2px 10px rgba(23, 38, 51, 0.05)'
      }}>
        {[
          { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Syllabus', path: '/syllabus', icon: Compass },
          { name: 'Portions', path: '/portions', icon: CheckSquare },
          { name: 'Tests', path: '/tests', icon: FileText },
          { name: 'Friends', path: '/friends', icon: Users }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeNavItem ? activeNavItem.path === item.path : location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isActive ? 'var(--color-teal-100)' : 'transparent',
                color: isActive ? 'var(--color-teal-700)' : 'var(--color-muted)',
                fontSize: '11px',
                fontWeight: isActive ? 800 : 500,
                minWidth: '56px',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
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
          .app-shell {
            width: 100vw !important;
            max-width: 100vw !important;
            overflow-x: hidden !important;
            box-sizing: border-box !important;
          }
          .main-content {
            margin-left: 0 !important;
            padding-top: calc(var(--header-height) + var(--safe-area-top));
            padding-bottom: calc(var(--mobile-nav-height) + var(--safe-area-bottom));
            width: 100% !important;
            max-width: 100vw !important;
            min-width: 0 !important;
            box-sizing: border-box !important;
            overflow-x: hidden !important;
          }
        }
      `}</style>
    </div>
  );
}

