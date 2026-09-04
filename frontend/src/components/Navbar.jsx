import { NavLink } from 'react-router-dom';
import { Activity, Users, Sparkles, RefreshCw } from 'lucide-react';

export function Navbar({ fetchData, loading }) {
  return (
    <nav className="navbar">
      <div className="container">
        <NavLink to="/" className="brand-logo">
          <div className="brand-logo-badge">
            <Sparkles size={22} color="#FFF" />
          </div>
          <span className="brand-text">HirePulse</span>
        </NavLink>

        <ul className="nav-links">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              end
            >
              <Activity className="nav-svg" size={18} />
              <span>Analytics Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/applications" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Users className="nav-svg" size={18} />
              <span>Applications</span>
            </NavLink>
          </li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="user-badge badge-seeker">Job Seeker</span>
          <button className="btn btn-primary btn-sm" onClick={fetchData}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            Sync API
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
