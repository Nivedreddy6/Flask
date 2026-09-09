import { NavLink } from 'react-router-dom';
import { Briefcase, Users, Sparkles, RefreshCw, Circle } from 'lucide-react';

export function Navbar({ fetchData, loading, status }) {
  return (
    <nav className="navbar" style={{ padding: '10px 0' }}>
      <div className="container">
        <NavLink to="/" className="brand-logo" style={{ fontSize: '1.35rem' }}>
          <div className="brand-logo-badge" style={{ width: 34, height: 34 }}>
            <Sparkles size={18} color="#FFF" />
          </div>
          <span className="brand-text">Job Sphere Studio</span>
        </NavLink>

        <ul className="nav-links">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              end
            >
              <Briefcase className="nav-svg" size={16} />
              <span>Job Discovery Feed</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/applications" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Users className="nav-svg" size={16} />
              <span>Recruiter ATS Pipeline</span>
            </NavLink>
          </li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="/" className="btn btn-outline btn-sm" style={{ padding: '6px 14px', fontSize: 12, textDecoration: 'none', color: '#60A5FA', borderColor: 'rgba(96, 165, 250, 0.4)' }}>
            ← Main Portal
          </a>

          <div style={{
            background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399', padding: '4px 10px', borderRadius: 16, fontSize: 11.5, fontWeight: 800,
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
            API Connected
          </div>

          <button className="btn btn-primary btn-sm" onClick={fetchData} disabled={loading} style={{ padding: '6px 12px', fontSize: 12 }}>
            <RefreshCw size={12} className={loading ? 'spin' : ''} />
            Sync
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
