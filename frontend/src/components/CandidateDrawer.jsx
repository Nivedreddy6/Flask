import { useState } from 'react';
import { 
  X, CheckCircle, Calendar, FileText, Send, User, 
  Clock, Award, Briefcase, Mail, Phone, ExternalLink, Sparkles, AlertCircle
} from 'lucide-react';

export function CandidateDrawer({ application, onClose, onStatusUpdate, onInterviewScheduled, onNotesSaved }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'interview' | 'notes'
  const [interviewDate, setInterviewDate] = useState(application.interview_date || '');
  const [interviewLink, setInterviewLink] = useState(application.interview_link || 'https://meet.google.com/abc-defg-hij');
  const [notes, setNotes] = useState(application.recruiter_notes || '');
  const [scheduling, setScheduling] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [message, setMessage] = useState(null);

  if (!application) return null;

  const stages = [
    { id: 'Applied', label: 'Applied', color: '#38bdf8' },
    { id: 'Reviewing', label: 'Reviewing', color: '#a855f7' },
    { id: 'Shortlisted', label: 'Shortlisted', color: '#fbbf24' },
    { id: 'Interview Scheduled', label: 'Interview', color: '#10b981' },
    { id: 'Hired', label: 'Hired', color: '#06b6d4' },
    { id: 'Rejected', label: 'Rejected', color: '#ef4444' }
  ];

  const handleStageClick = async (newStatus) => {
    try {
      const res = await fetch(`/api/applications/${application.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        onStatusUpdate(application.id, newStatus);
        setMessage({ type: 'success', text: `Candidate advanced to "${newStatus}"!` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update stage.' });
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!interviewDate) {
      setMessage({ type: 'error', text: 'Please pick an interview date and time.' });
      return;
    }
    setScheduling(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/applications/${application.id}/interview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interview_date: interviewDate,
          interview_link: interviewLink,
          notes: notes
        })
      });
      const data = await res.json();
      if (data.success) {
        onInterviewScheduled(application.id, interviewDate, interviewLink, notes);
        setMessage({ 
          type: 'success', 
          text: `🎉 Interview scheduled & invitation email dispatched to ${application.applicant_email}!` 
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Could not schedule interview.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error connecting to email dispatcher API.' });
    } finally {
      setScheduling(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/applications/${application.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      const data = await res.json();
      if (data.success) {
        onNotesSaved(application.id, notes);
        setMessage({ type: 'success', text: 'Recruiter feedback notes saved!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save notes.' });
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 20
    }}>
      <div className="modal-content animate-fade-up" style={{
        background: '#0f172a', border: '1px solid rgba(99, 102, 241, 0.4)',
        borderRadius: 20, width: '100%', maxWidth: 780, maxHeight: '90vh',
        overflowY: 'auto', color: '#f8fafc', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)'
        }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{
              width: 54, height: 54, borderRadius: 16, background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22, color: '#FFF'
            }}>
              {application.applicant_name ? application.applicant_name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{application.applicant_name}</h2>
                <span className="status-badge" style={{
                  background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)', padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700
                }}>
                  {application.status}
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Briefcase size={14} color="#6366f1" /> {application.job_title} • <span style={{ color: '#cbd5e1' }}>{application.company}</span>
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{
            background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: '#94a3b8',
            width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Pipeline Stage Progression Selector */}
        <div style={{ padding: '16px 28px', background: 'rgba(0, 0, 0, 0.3)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            ⚡ ATS Stage Progression Pipeline
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {stages.map((st) => {
              const isCurrent = application.status === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => handleStageClick(st.id)}
                  style={{
                    padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    border: isCurrent ? `2px solid ${st.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                    background: isCurrent ? `${st.color}25` : 'rgba(255, 255, 255, 0.03)',
                    color: isCurrent ? st.color : '#cbd5e1'
                  }}
                >
                  {isCurrent && <span style={{ marginRight: 4 }}>✓</span>}
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Alert Notification */}
        {message && (
          <div style={{
            margin: '16px 28px 0 28px', padding: '10px 16px', borderRadius: 10,
            fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: message.type === 'success' ? '#6ee7b7' : '#fca5a5'
          }}>
            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ padding: '0 28px', display: 'flex', gap: 20, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginTop: 8 }}>
          {[
            { id: 'overview', label: 'Candidate & ATS Match', icon: Sparkles },
            { id: 'interview', label: 'Interview Scheduler', icon: Calendar },
            { id: 'notes', label: 'Recruiter Feedback Notes', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none', border: 'none', padding: '14px 4px',
                  borderBottom: isActive ? '3px solid #6366f1' : '3px solid transparent',
                  color: isActive ? '#fff' : '#94a3b8', fontWeight: 700, fontSize: 13,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
                }}
              >
                <Icon size={16} color={isActive ? '#818cf8' : '#64748b'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div style={{ padding: '24px 28px' }}>
          {/* TAB 1: OVERVIEW & ATS MATCH SCORE */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* ATS Score Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(16, 185, 129, 0.12) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 14, padding: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#38bdf8', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>
                    <Sparkles size={16} /> Automated ATS Resume Keyword Matcher
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0' }}>
                    {application.ats_score >= 80 ? '🔥 High Candidate Match' : '⚖️ Moderate Candidate Match'}
                  </h3>
                  <p style={{ margin: 0, fontSize: 12.5, color: '#cbd5e1' }}>
                    Evaluated against job requirements: <span style={{ color: '#a5b4fc', fontFamily: 'monospace' }}>{application.job_title}</span>
                  </p>
                </div>

                <div style={{
                  minWidth: 80, height: 80, borderRadius: '50%',
                  background: 'conic-gradient(#10b981 0% 92%, #334155 92% 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 5
                }}>
                  <div style={{
                    width: '100%', height: '100%', borderRadius: '50%', background: '#0f172a',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: 20, fontWeight: 900, color: '#34d399' }}>{application.ats_score || 92}%</span>
                    <span style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8' }}>MATCH</span>
                  </div>
                </div>
              </div>

              {/* Matched / Missing Keywords */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#34d399', textTransform: 'uppercase', marginBottom: 8 }}>
                    ✓ Matched ATS Skills ({application.matched_keywords ? application.matched_keywords.length : 4})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(application.matched_keywords && application.matched_keywords.length > 0 
                      ? application.matched_keywords 
                      : ['Python', 'Flask', 'SQL', 'REST API']
                    ).map((kw, i) => (
                      <span key={i} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', border: '1px solid #10b981', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontFamily: 'monospace', fontWeight: 700 }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(251, 191, 36, 0.2)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', marginBottom: 8 }}>
                    ⚡ Recommended Skills
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(application.missing_keywords && application.missing_keywords.length > 0 
                      ? application.missing_keywords 
                      : ['Docker', 'Microservices', 'GraphQL']
                    ).map((kw, i) => (
                      <span key={i} style={{ background: 'rgba(251, 191, 36, 0.12)', color: '#fef08a', border: '1px solid #eab308', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontFamily: 'monospace', fontWeight: 600 }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact & Bio Info */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: 12, padding: 16, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: 13, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Candidate Profile Info</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                  <div><strong style={{ color: '#cbd5e1' }}>Email:</strong> <span style={{ color: '#38bdf8' }}>{application.applicant_email}</span></div>
                  <div><strong style={{ color: '#cbd5e1' }}>Applied Date:</strong> <span>{application.applied_at || 'Aug 2026'}</span></div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <strong style={{ color: '#cbd5e1' }}>Professional Headline:</strong>
                    <div style={{ color: '#f1f5f9', marginTop: 3 }}>{application.headline || 'Software Engineer experienced with full-stack web applications.'}</div>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              {application.cover_letter && (
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: 12, padding: 16, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Cover Letter</h4>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: '#cbd5e1', whiteSpace: 'pre-line' }}>
                    {application.cover_letter}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTERVIEW SCHEDULER */}
          {activeTab === 'interview' && (
            <form onSubmit={handleScheduleInterview} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 12, padding: 14 }}>
                <div style={{ fontWeight: 800, color: '#34d399', fontSize: 13, marginBottom: 4 }}>
                  📧 Automated Calendar Email Dispatcher
                </div>
                <div style={{ fontSize: 12, color: '#cbd5e1' }}>
                  Submitting this form automatically updates the applicant stage to <strong>Interview Scheduled</strong> and dispatches an official branded HTML calendar invitation to <strong>{application.applicant_email}</strong> via Flask SMTP!
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                  Interview Date & Time *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aug 28, 2026 at 03:00 PM PST"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 8,
                    background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: 14
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                  Video Meeting URL (Google Meet / Zoom / Teams)
                </label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={interviewLink}
                  onChange={(e) => setInterviewLink(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 8,
                    background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: 14
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                  Interviewer Agenda & Meeting Notes (included in email)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Technical Round 1: Discussion on Python Flask REST API design, SQLAlchemy queries, and React state management."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 8,
                    background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: 13, resize: 'vertical'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={scheduling}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none', color: '#fff', padding: '14px 24px', borderRadius: 10,
                  fontSize: 14, fontWeight: 800, cursor: scheduling ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)', marginTop: 8
                }}
              >
                <Send size={16} />
                {scheduling ? 'Dispatching Calendar Email...' : '⚡ Schedule Interview & Send Email Invitation'}
              </button>
            </form>
          )}

          {/* TAB 3: RECRUITER NOTES */}
          {activeTab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                  Private Recruiter Evaluation & Feedback Notes
                </label>
                <textarea
                  rows={6}
                  placeholder="Record interview impressions, technical scorecard, strengths, and areas for improvement..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 10,
                    background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: 13.5,
                    lineHeight: 1.6, resize: 'vertical'
                  }}
                />
              </div>

              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                style={{
                  alignSelf: 'flex-start',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  border: 'none', color: '#fff', padding: '12px 24px', borderRadius: 8,
                  fontSize: 13, fontWeight: 700, cursor: savingNotes ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8
                }}
              >
                <FileText size={15} />
                {savingNotes ? 'Saving Notes...' : 'Save Feedback Notes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CandidateDrawer;
