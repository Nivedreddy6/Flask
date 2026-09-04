export function ApplicationsTable({ jobs }) {
  return (
    <div className="animate-fade-up">
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF', marginBottom: 20 }}>Applications Overview</h2>
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.slice(0, 5).map((job) => (
              <tr key={job.id}>
                <td style={{ fontWeight: 800, color: '#FFF' }}>{job.title}</td>
                <td>{job.company}</td>
                <td>{job.location}</td>
                <td><span className="tag">{job.job_type}</span></td>
                <td><span className="status-badge status-accepted">Easy Applied</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ApplicationsTable;
