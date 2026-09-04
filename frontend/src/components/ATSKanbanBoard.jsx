import { useState } from 'react';
import { 
  Users, Sparkles, ChevronRight, Calendar, CheckCircle, 
  Search, Filter, Briefcase, Mail, ArrowRight, Eye, UserCheck, XCircle
} from 'lucide-react';

export function ATSKanbanBoard({ applications, onSelectCandidate, onQuickStageAdvance }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('all');

  const columns = [
    { id: 'Applied', title: 'Applied', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.08)' },
    { id: 'Reviewing', title: 'Reviewing', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.08)' },
    { id: 'Shortlisted', title: 'Shortlisted', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.08)' },
    { id: 'Interview Scheduled', title: 'Interview Scheduled', color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)' },
    { id: 'Hired', title: 'Hired', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.08)' },
    { id: 'Rejected', title: 'Rejected', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)' }
  ];

  // Unique job titles for filter dropdown
  const uniqueJobs = Array.from(new Set(applications.map(a => a.job_title).filter(Boolean)));

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      (app.applicant_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.job_title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.skills || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJob = selectedJobFilter === 'all' || app.job_title === selectedJobFilter;
    return matchesSearch && matchesJob;
  });

  const getNextStage = (currentStage) => {
    const stageOrder = ['Applied', 'Reviewing', 'Shortlisted', 'Interview Scheduled', 'Hired'];
    const idx = stageOrder.indexOf(currentStage);
    if (idx !== -1 && idx < stageOrder.length - 1) {
      return stageOrder[idx + 1];
    }
    return null;
  };

  return (
    <div className="ats-kanban-container animate-fade-up">
      {/* Search & Filter Toolbar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 16, marginBottom: 24, flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: 12, flex: 1, minWidth: 280 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: 13 }} />
            <input
              type="text"
              placeholder="Search candidate name, job title, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px 10px 38px', borderRadius: 10,
                background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #334155',
                color: '#fff', fontSize: 13
              }}
            />
          </div>

          <select
            value={selectedJobFilter}
            onChange={(e) => setSelectedJobFilter(e.target.value)}
            style={{
              padding: '10px 14px', borderRadius: 10,
              background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #334155',
              color: '#fff', fontSize: 13, minWidth: 180
            }}
          >
            <option value="all">All Job Vacancies ({applications.length})</option>
            {uniqueJobs.map(job => (
              <option key={job} value={job}>{job}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.15)', border: '1px solid #6366f1',
            padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, color: '#a5b4fc',
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            <Sparkles size={14} /> Total in ATS: {applications.length} Candidates
          </div>
        </div>
      </div>

      {/* 6-Stage Kanban Board Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16,
        alignItems: 'start'
      }}>
        {columns.map(col => {
          const colApps = filteredApps.filter(a => (a.status || 'Applied') === col.id);

          return (
            <div
              key={col.id}
              style={{
                background: col.bg,
                border: `1px solid ${col.color}30`,
                borderRadius: 14,
                padding: '14px 12px',
                minHeight: 450,
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              {/* Column Header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingBottom: 10, borderBottom: `1px solid ${col.color}25`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{col.title}</span>
                </div>
                <span style={{
                  background: `${col.color}25`, color: col.color,
                  fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 10
                }}>
                  {colApps.length}
                </span>
              </div>

              {/* Cards in Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {colApps.map(app => {
                  const nextStage = getNextStage(app.status);

                  return (
                    <div
                      key={app.id}
                      style={{
                        background: '#0f172a',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 12,
                        padding: 14,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        transition: 'transform 0.2s ease, border-color 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onClick={() => onSelectCandidate(app)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.borderColor = col.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0px)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      }}
                    >
                      {/* Top row: Name + ATS Score Badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>
                            {app.applicant_name}
                          </div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                            {app.headline || 'Full-Stack Developer'}
                          </div>
                        </div>

                        {/* ATS Match Score Pill */}
                        <div style={{
                          background: app.ats_score >= 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                          border: `1px solid ${app.ats_score >= 80 ? '#10b981' : '#f59e0b'}`,
                          color: app.ats_score >= 80 ? '#6ee7b7' : '#fef08a',
                          padding: '2px 7px', borderRadius: 8, fontSize: 10.5, fontWeight: 800,
                          display: 'flex', alignItems: 'center', gap: 3
                        }}>
                          <Sparkles size={10} /> {app.ats_score || 90}% ATS
                        </div>
                      </div>

                      {/* Job & Company */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.03)', padding: '6px 8px', borderRadius: 6,
                        fontSize: 11.5, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6
                      }}>
                        <Briefcase size={12} color="#6366f1" />
                        <span style={{ fontWeight: 600, color: '#fff' }}>{app.job_title}</span>
                      </div>

                      {/* Matched Keywords Tags */}
                      {app.matched_keywords && app.matched_keywords.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {app.matched_keywords.slice(0, 3).map((kw, i) => (
                            <span key={i} style={{
                              background: 'rgba(16, 185, 129, 0.1)', color: '#34d399',
                              fontSize: 9.5, padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace'
                            }}>
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Interview Badge if Scheduled */}
                      {app.interview_date && (
                        <div style={{
                          background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: 6, padding: '4px 8px', fontSize: 10.5, color: '#6ee7b7',
                          display: 'flex', alignItems: 'center', gap: 6
                        }}>
                          <Calendar size={12} /> {app.interview_date}
                        </div>
                      )}

                      {/* Bottom Action Buttons */}
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        paddingTop: 8, borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: 2
                      }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); onSelectCandidate(app); }}
                          style={{
                            background: 'none', border: 'none', color: '#94a3b8', fontSize: 11,
                            fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                          }}
                        >
                          <Eye size={12} /> Review
                        </button>

                        {nextStage && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onQuickStageAdvance(app.id, nextStage); }}
                            style={{
                              background: 'rgba(99, 102, 241, 0.2)', border: '1px solid #6366f1',
                              color: '#c7d2fe', fontSize: 10.5, fontWeight: 700, padding: '3px 8px',
                              borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                            }}
                          >
                            Advance ➔
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {colApps.length === 0 && (
                  <div style={{
                    padding: '24px 10px', textAlign: 'center', color: '#64748b', fontSize: 12,
                    border: '1px dashed rgba(255, 255, 255, 0.08)', borderRadius: 10
                  }}>
                    No candidates in {col.title}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ATSKanbanBoard;
