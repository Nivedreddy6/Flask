import { useState } from 'react';
import { Sparkles, Briefcase, Users, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import JobDiscoveryFeed from '../components/JobDiscoveryFeed';
import JobApplyModal from '../components/JobApplyModal';

export function DashboardPage({ jobs, status }) {
  const [applyingJob, setApplyingJob] = useState(null);

  return (
    <div className="dashboard-page animate-fade-up">
      {/* Hero Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.35)',
        borderRadius: 20, padding: '24px 28px', marginBottom: 24,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#38bdf8', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
            <Sparkles size={16} /> Job Sphere Studio • Live Recruitment Platform
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFF', margin: '6px 0 4px 0' }}>
            Candidate Job Discovery &amp; Automated ATS
          </h1>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: 13.5 }}>
            Browse verified tech vacancies with transparent salaries or manage applicant pipelines with automated email scheduling.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <NavLink
            to="/applications"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#FFF', padding: '10px 18px', borderRadius: 10,
              fontSize: 13, fontWeight: 800, textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
            }}
          >
            <Users size={16} /> Open Recruiter ATS Pipeline <ArrowRight size={14} />
          </NavLink>
        </div>
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
