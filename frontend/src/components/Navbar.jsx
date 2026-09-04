import { NavLink } from 'react-router-dom';
import { Briefcase, Users, Sparkles, RefreshCw, Layers } from 'lucide-react';

export function Navbar({ fetchData, loading }) {
  return (
    <nav className="navbar">
      <div className="container">
        <NavLink to="/" className="brand-logo">
          <div className="brand-logo-badge">
            <Sparkles size={20} color="#FFF" />
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
              <Briefcase className="nav-svg" size={17} />
              <span>Job Discovery Feed</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/applications" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Users className="nav-svg" size={17} />
              <span>Recruiter ATS Pipeline</span>
            </NavLink>
          </li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="user-badge badge-seeker" style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(16, 185, 129, 0.2))',
            border: '1px solid #6366f1', color: '#c7d2fe', padding: '4px 12px', borderRadius: 20, fontSize: 11.5, fontWeight: 800
          }}>
            ⚡ ATS Active
          </span>
          <button className="btn btn-primary btn-sm" onClick={fetchData} disabled={loading}>
            <RefreshCw size={13} className={loading ? 'spin' : ''} />
            Sync API
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
