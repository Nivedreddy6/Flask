import { useState } from 'react';
import { Sparkles, Users, ArrowRight, Briefcase, Zap } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import JobDiscoveryFeed from '../components/JobDiscoveryFeed';
import JobApplyModal from '../components/JobApplyModal';

export function DashboardPage({ jobs, status }) {
  const [applyingJob, setApplyingJob] = useState(null);

  return (
    <div className="dashboard-page animate-fade-up">
      {/* Compact Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.16) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 14, padding: '16px 20px', marginBottom: 16,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={18} color="#FFF" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFF', margin: 0, lineHeight: 1.2 }}>
              Candidate Job Discovery Feed
            </h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: 12 }}>
              Explore tech vacancies with verified salaries, match your skills, or apply with 1-click ATS resumes.
            </p>
          </div>
        </div>

        <NavLink
          to="/applications"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#FFF', padding: '8px 16px', borderRadius: 8,
            fontSize: 12, fontWeight: 800, textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
          }}
        >
          <Users size={14} /> Open Recruiter ATS Pipeline <ArrowRight size={13} />
        </NavLink>
      </div>

      {/* Main Job Discovery Feed */}
      <JobDiscoveryFeed
        jobs={jobs || []}
        onApplyClick={(job) => setApplyingJob(job)}
      />

      {/* 1-Click Application Modal */}
      {applyingJob && (
        <JobApplyModal
          job={applyingJob}
          onClose={() => setApplyingJob(null)}
          onApplicationSuccess={(data) => {
            console.log('Application submitted:', data);
          }}
        />
      )}
    </div>
  );
}

export default DashboardPage;
