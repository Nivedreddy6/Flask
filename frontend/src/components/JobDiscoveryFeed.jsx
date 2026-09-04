import { useState } from 'react';
import { 
  Briefcase, MapPin, DollarSign, Clock, Sparkles, 
  Search, Filter, Send, CheckCircle2, ChevronRight 
} from 'lucide-react';

export function JobDiscoveryFeed({ jobs, onApplyClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const categories = ['all', 'Engineering', 'Design', 'Data Science', 'Security'];
  const jobTypes = ['all', 'Full-time', 'Contract', 'Remote'];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.company || job.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.requirements || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.skills_required || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || (job.category || '').toLowerCase() === selectedCategory.toLowerCase();
    const matchesType = selectedType === 'all' || (job.job_type || '').toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="job-discovery-container animate-fade-up">
      {/* Search & Filter Bar */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: 14, padding: '12px 16px', marginBottom: 16,
        display: 'flex', flexDirection: 'column', gap: 10,
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 11 }} />
            <input
              type="text"
              placeholder="Search tech jobs, companies, or required skills (Python, React, SQL)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px 8px 34px', borderRadius: 8,
                background: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 13
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '8px 12px', borderRadius: 8,
                background: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 12.5
              }}
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Data Science">Data Science</option>
              <option value="Security">Security</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                padding: '8px 12px', borderRadius: 8,
                background: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: 12.5
              }}
            >
              <option value="all">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: '#94a3b8' }}>
          <div>
            Showing <strong style={{ color: '#38bdf8' }}>{filteredJobs.length}</strong> active tech job openings
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#34d399', fontWeight: 700 }}>
            <Sparkles size={13} /> 100% Transparent Salary Ranges &amp; ATS Matching
          </div>
        </div>
      </div>

      {/* Job Cards Grid - Full Width Responsive */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {filteredJobs.map(job => (
          <div
            key={job.id}
            style={{
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 14, padding: '16px 18px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.2s ease',
              position: 'relative', overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateY(0px)';
            }}
          >
            {/* Top Accent Line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: 'linear-gradient(90deg, #6366f1, #3b82f6, #10b981)'
            }} />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFF', margin: '0 0 2px 0' }}>
                    {job.title}
                  </h3>
                  <div style={{ fontSize: 12.5, color: '#94a3b8', fontWeight: 600 }}>
                    {job.company || job.company_name}
                  </div>
                </div>

                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)', color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '2px 8px', borderRadius: 6, fontSize: 10.5, fontWeight: 800
                }}>
                  {job.job_type || 'Full-time'}
                </span>
              </div>

              {/* Location & Salary Badges */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10, fontSize: 11.5 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#cbd5e1' }}>
                  <MapPin size={12} color="#6366f1" /> {job.location || 'Remote'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#38bdf8', fontWeight: 700 }}>
                  <DollarSign size={12} color="#38bdf8" /> {job.salary_range || '$120,000 - $150,000 / year'}
                </span>
              </div>

              {/* Description Snippet */}
              <p style={{
                fontSize: 12, color: '#94a3b8', lineHeight: 1.45, margin: '0 0 12px 0',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
              }}>
                {job.description}
              </p>

              {/* Required Skills tags */}
              {job.skills_required && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
                  {job.skills_required.split(',').map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'rgba(99, 102, 241, 0.12)', color: '#c7d2fe',
                        padding: '2px 7px', borderRadius: 5, fontSize: 10, fontFamily: 'monospace', fontWeight: 600
                      }}
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Apply Action Button */}
            <button
              onClick={() => onApplyClick(job)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                border: 'none', color: '#FFF', padding: '9px 14px', borderRadius: 8,
                fontSize: 12.5, fontWeight: 800, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)', transition: 'all 0.2s ease'
              }}
            >
              <Send size={13} /> 1-Click Apply with ATS Resume ➔
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobDiscoveryFeed;
