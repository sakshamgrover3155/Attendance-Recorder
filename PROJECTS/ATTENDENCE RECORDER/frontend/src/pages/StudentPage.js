import React from 'react';
import Layout from '../components/Layout';
import StudentDashboard from '../components/StudentDashboard';

const StudentPage = () => {
  return (
    <Layout title="Student Dashboard">
      <StudentDashboard />
    </Layout>
  );
};

export default StudentPage;