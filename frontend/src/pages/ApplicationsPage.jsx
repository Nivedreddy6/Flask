import ApplicationsTable from '../components/ApplicationsTable';

export function ApplicationsPage({ jobs }) {
  return (
    <div>
      <ApplicationsTable jobs={jobs} />
    </div>
  );
}

export default ApplicationsPage;
