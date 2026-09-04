import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TopBanner from './components/TopBanner';
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';

export function App() {
  const [status, setStatus] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusRes, jobsRes] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/jobs')
      ]);

      if (!statusRes.ok || !jobsRes.ok) {
        throw new Error('Could not connect to Flask backend server');
      }

      const statusData = await statusRes.json();
      const jobsData = await jobsRes.json();

      setStatus(statusData);
      setJobs(jobsData.jobs || []);
    } catch (err) {
      setError(err.message || 'Error connecting to backend API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar fetchData={fetchData} loading={loading} />

      {/* Main Content Area */}
      <main className="main-content">
        <div className="container">
          <TopBanner status={status} />

          {error && (
            <div className="form-card" style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#FCA5A5', marginBottom: 24 }}>
              <strong>API Error:</strong> {error}. Ensure your Flask server (`python app.py`) is active on port 5000.
            </div>
          )}

          {/* Page Routing */}
          <Routes>
            <Route 
              path="/" 
              element={<DashboardPage jobs={jobs} status={status} />} 
            />
            <Route 
              path="/applications" 
              element={<ApplicationsPage />} 
            />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '24px 0', background: '#0b0f19' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: 13 }}>
            © 2026 <strong>Job Sphere Studio</strong> • Full-Stack Flask 3.0 + React 19 ATS Ecosystem
          </p>
          <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
            <span style={{ color: '#38bdf8' }}>⚡ Real-time ATS Pipeline</span>
            <span style={{ color: '#34d399' }}>📧 Automated Calendar Mailer</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
