import { Activity, Briefcase, Users, ChevronRight } from 'lucide-react';

export function AnalyticsDashboard({ status }) {
  return (
    <div className="animate-fade-up">
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF', marginBottom: 20 }}>System & Ecosystem Analytics</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 28 }}>
        <div className="category-card">
          <div className="category-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA' }}>
            <Activity size={26} />
          </div>
          <div className="category-title">Backend API Health</div>
          <div className="category-subtext">Flask 3.0 server with CORS support</div>
          <div className="category-footer">
            <span className="category-count">{status?.status?.toUpperCase() || 'ONLINE'}</span>
            <div className="category-arrow"><ChevronRight size={16} /></div>
          </div>
        </div>

        <div className="category-card">
          <div className="category-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#C084FC' }}>
            <Briefcase size={26} />
          </div>
          <div className="category-title">Active Job Postings</div>
          <div className="category-subtext">Total active job offers in database</div>
          <div className="category-footer">
            <span className="category-count">{status?.total_active_jobs ?? 0} Listings</span>
            <div className="category-arrow"><ChevronRight size={16} /></div>
          </div>
        </div>

        <div className="category-card">
          <div className="category-icon" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#67E8F9' }}>
            <Users size={26} />
          </div>
          <div className="category-title">Total Users</div>
          <div className="category-subtext">Job seekers & recruiters registered</div>
          <div className="category-footer">
            <span className="category-count">{status?.total_users ?? 0} Accounts</span>
            <div className="category-arrow"><ChevronRight size={16} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
