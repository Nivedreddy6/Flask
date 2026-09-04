import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Sparkles, CheckCircle, AlertCircle, FileUp, Briefcase } from 'lucide-react';

export function JobApplyModal({ job, onClose, onApplicationSuccess }) {
  const [name, setName] = useState('Nived Reddy');
  const [email, setEmail] = useState('nivedreddy6@gmail.com');
  const [headline, setHeadline] = useState('Full Stack Python & React Developer');
  const [skills, setSkills] = useState('Python, Flask, React, SQL, REST APIs, Docker');
  const [coverLetter, setCoverLetter] = useState(
    `Dear Hiring Team at ${job?.company_name || 'TechCorp AI'},\n\nI am excited to apply for the ${job?.title || 'Open Position'} role. With strong full-stack engineering expertise across Flask REST APIs and React 19 web applications, I would love to contribute to your team!`
  );
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!job) return null;

  // Simple instant live ATS score calculation
  const getPreviewAtsScore = () => {
    const jobSkills = (job.skills_required || '').toLowerCase();
    const mySkills = skills.toLowerCase();
    const keywords = ['python', 'flask', 'react', 'sql', 'rest', 'docker', 'javascript', 'figma', 'html', 'css', 'backend', 'frontend'];
    let matches = 0;
    keywords.forEach(k => {
      if (mySkills.includes(k) && jobSkills.includes(k)) matches++;
    });
    return Math.min(98, Math.max(60, 60 + matches * 8));
  };

  const atsScore = getPreviewAtsScore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/applications/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: job.id,
          name,
          email,
          headline,
          skills,
          cover_letter: coverLetter
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg({ type: 'success', text: `🎉 Application submitted! Calculated ATS Match Score: ${data.ats_score}%` });
        if (onApplicationSuccess) onApplicationSuccess(data);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to submit application.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Error connecting to application API.' });
    } finally {
      setSubmitting(false);
    }
  };

  const modalContent = (
    <div 
      className="modal-overlay" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        padding: 16,
        overflowY: 'auto'
      }}
    >
      <div 
        className="modal-content animate-fade-up" 
        style={{
          background: '#0f172a',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: 18,
          width: '100%',
          maxWidth: 620,
          maxHeight: '92vh',
          overflowY: 'auto',
          color: '#f8fafc',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 30px rgba(99, 102, 241, 0.25)',
          margin: 'auto',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.22) 0%, rgba(6, 182, 212, 0.12) 100%)'
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: 1 }}>
              ⚡ 1-Click Candidate Application
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '3px 0 0 0', color: '#FFF' }}>
              Apply for {job.title}
            </h2>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              {job.company_name || 'TechCorp AI'} • <span style={{ color: '#34d399', fontWeight: 700 }}>{job.salary_range}</span>
            </div>
          </div>

          <button 
            onClick={onClose} 
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#94a3b8',
              width: 32,
              height: 32,
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Live ATS Match Preview Pill */}
        <div style={{
          margin: '14px 22px 0 22px',
          padding: '10px 14px',
          borderRadius: 10,
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={15} color="#34d399" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>Live ATS Resume Match Score:</span>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#FFF',
            padding: '3px 10px',
            borderRadius: 16,
            fontSize: 11.5,
            fontWeight: 900
          }}>
            {atsScore}% MATCH
          </div>
        </div>

        {statusMsg && (
          <div style={{
            margin: '12px 22px 0 22px',
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 12.5,
            fontWeight: 600,
            background: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${statusMsg.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: statusMsg.type === 'success' ? '#6ee7b7' : '#fca5a5',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            {statusMsg.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
            {statusMsg.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '14px 22px 22px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: 12.5 }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: 12.5 }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>Professional Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: 12.5 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>
              Skills (Comma Separated for ATS Matcher) *
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Python, Flask, React, SQL, REST API, Docker"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: 12.5 }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>Cover Letter / Why You're a Great Fit</label>
            <textarea
              rows={3}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              style={{ 
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8, 
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#fff', 
                fontSize: 12.5,
                resize: 'vertical',
                fontFamily: 'inherit',
                lineHeight: 1.45
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              border: 'none',
              color: '#fff',
              padding: '11px 18px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 800,
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
              marginTop: 4
            }}
          >
            <Send size={14} />
            {submitting ? 'Submitting to ATS Pipeline...' : 'Submit Application & Send to Recruiter ATS'}
          </button>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default JobApplyModal;
