import { useState, useEffect } from 'react';
import { 
  Users, Sparkles, LayoutGrid, List, RefreshCw, 
  Calendar, Award, CheckCircle, Clock, Search, ArrowRight, Eye, Briefcase
} from 'lucide-react';
import ATSKanbanBoard from '../components/ATSKanbanBoard';
import CandidateDrawer from '../components/CandidateDrawer';

export function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/applications');
      if (!res.ok) throw new Error('Failed to fetch ATS applications.');
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err) {
      setError(err.message || 'Error loading applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleQuickStageAdvance = async (appId, nextStage) => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStage })
      });
      const data = await res.json();
      if (data.success) {
        setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: nextStage } : a));
        showToast(`Candidate transitioned to stage: "${nextStage}"!`);
      }
    } catch (err) {
      showToast('Failed to transition candidate stage.', 'error');
    }
  };

  const handleStatusUpdate = (appId, newStatus) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    if (selectedCandidate && selectedCandidate.id === appId) {
      setSelectedCandidate(prev => ({ ...prev, status: newStatus }));
    }
    showToast(`Status updated to "${newStatus}"!`);
  };

  const handleInterviewScheduled = (appId, date, link, notes) => {
    setApplications(prev => prev.map(a => a.id === appId ? {
      ...a, status: 'Interview Scheduled', interview_date: date, interview_link: link, recruiter_notes: notes
    } : a));
    if (selectedCandidate && selectedCandidate.id === appId) {
      setSelectedCandidate(prev => ({
        ...prev, status: 'Interview Scheduled', interview_date: date, interview_link: link, recruiter_notes: notes
      }));
    }
    showToast(`Interview scheduled & email dispatched for ${date}!`);
  };

  const handleNotesSaved = (appId, notes) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, recruiter_notes: notes } : a));
    if (selectedCandidate && selectedCandidate.id === appId) {
      setSelectedCandidate(prev => ({ ...prev, recruiter_notes: notes }));
    }
    showToast('Recruiter notes saved.');
  };

  // Metrics
  const totalCount = applications.length;
  const appliedCount = applications.filter(a => a.status === 'Applied').length;
  const reviewingCount = applications.filter(a => a.status === 'Reviewing').length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
  const interviewCount = applications.filter(a => a.status === 'Interview Scheduled').length;
  const hiredCount = applications.filter(a => a.status === 'Hired').length;

  return (
    <div className="ats-master-hub animate-fade-up">
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 2000,
          background: toast.type === 'success' ? '#065f46' : '#991b1b',
          color: '#FFF', padding: '12px 20px', borderRadius: 12,
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)',
          fontWeight: 700, fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 8
        }}>
          <CheckCircle size={18} /> {toast.message}
        </div>
      )}

      {/* Page Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 20, flexWrap: 'wrap', gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#38bdf8', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
            <Sparkles size={16} /> Automated Applicant Tracking System
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#FFF', margin: '4px 0 0 0' }}>
            Recruiter ATS Pipeline
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: 13.5 }}>
            Manage candidates across hiring stages, review ATS resume match scores, and schedule interviews with automated calendar emails.
          </p>
        </div>

        {/* View Switcher & Sync */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            background: '#0f172a', border: '1px solid #334155', borderRadius: 10, padding: 3, display: 'flex'
          }}>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                background: viewMode === 'kanban' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                border: 'none', color: viewMode === 'kanban' ? '#818cf8' : '#94a3b8',
                padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <LayoutGrid size={14} /> Kanban Pipeline
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                background: viewMode === 'table' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                border: 'none', color: viewMode === 'table' ? '#818cf8' : '#94a3b8',
                padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <List size={14} /> Table View
            </button>
          </div>

          <button
            onClick={fetchApplications}
            disabled={loading}
            style={{
              background: 'rgba(255, 255, 255, 0.05)', border: '1px solid #334155',
              color: '#fff', padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            <RefreshCw size={13} className={loading ? 'spin' : ''} /> Sync
          </button>
        </div>
      </div>

      {/* ATS Pipeline KPI Metric Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: 14, marginBottom: 24
      }}>
        {[
          { label: 'Total Applications', count: totalCount, color: '#818cf8', icon: Users },
          { label: 'In Review', count: reviewingCount, color: '#c084fc', icon: Clock },
          { label: 'Shortlisted', count: shortlistedCount, color: '#fbbf24', icon: Award },
          { label: 'Interviews Active', count: interviewCount, color: '#34d399', icon: Calendar },
          { label: 'Hired Talents', count: hiredCount, color: '#38bdf8', icon: CheckCircle }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              style={{
                background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: `${stat.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={20} color={stat.color} />
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#FFF' }}>{stat.count}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#94a3b8' }}>
          <RefreshCw size={28} className="spin" style={{ margin: '0 auto 12px auto', color: '#6366f1' }} />
          <div>Loading ATS Candidate Pipeline...</div>
        </div>
      ) : viewMode === 'kanban' ? (
        <ATSKanbanBoard
          applications={applications}
          onSelectCandidate={(app) => setSelectedCandidate(app)}
          onQuickStageAdvance={handleQuickStageAdvance}
        />
      ) : (
        /* Table View */
        <div className="table-card animate-fade-up" style={{
          background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
        }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1e293b', borderBottom: '1px solid #334155' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', color: '#94a3b8', fontSize: 11.5, textTransform: 'uppercase' }}>Candidate</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', color: '#94a3b8', fontSize: 11.5, textTransform: 'uppercase' }}>Applied Role</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', color: '#94a3b8', fontSize: 11.5, textTransform: 'uppercase' }}>ATS Match</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', color: '#94a3b8', fontSize: 11.5, textTransform: 'uppercase' }}>Stage</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', color: '#94a3b8', fontSize: 11.5, textTransform: 'uppercase' }}>Applied Date</th>
                <th style={{ padding: '14px 16px', textAlign: 'right', color: '#94a3b8', fontSize: 11.5, textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr
                  key={app.id}
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', cursor: 'pointer' }}
                  onClick={() => setSelectedCandidate(app)}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: 13.5 }}>{app.applicant_name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{app.applicant_email}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#cbd5e1', fontSize: 13 }}>{app.job_title}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{app.company}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      background: app.ats_score >= 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                      border: `1px solid ${app.ats_score >= 80 ? '#10b981' : '#f59e0b'}`,
                      color: app.ats_score >= 80 ? '#6ee7b7' : '#fef08a',
                      padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 800
                    }}>
                      {app.ats_score || 90}% Match
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="status-badge" style={{
                      background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc',
                      border: '1px solid rgba(99, 102, 241, 0.3)', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700
                    }}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8' }}>
                    {app.applied_at || 'Aug 2026'}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedCandidate(app); }}
                      style={{
                        background: 'rgba(99, 102, 241, 0.15)', border: '1px solid #6366f1',
                        color: '#c7d2fe', padding: '6px 12px', borderRadius: 8, fontSize: 11.5,
                        fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4
                      }}
                    >
                      <Eye size={13} /> Open ATS Drawer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Candidate Drawer Modal */}
      {selectedCandidate && (
        <CandidateDrawer
          application={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onStatusUpdate={handleStatusUpdate}
          onInterviewScheduled={handleInterviewScheduled}
          onNotesSaved={handleNotesSaved}
        />
      )}
    </div>
  );
}

export default ApplicationsPage;
