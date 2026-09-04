import AnalyticsDashboard from '../components/AnalyticsDashboard';

export function DashboardPage({ status }) {
  return (
    <div>
      <AnalyticsDashboard status={status} />
    </div>
  );
}

export default DashboardPage;
