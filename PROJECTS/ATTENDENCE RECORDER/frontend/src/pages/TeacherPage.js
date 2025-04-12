import React from 'react';
import Layout from '../components/Layout';
import TeacherDashboard from '../components/TeacherDashboard';

const TeacherPage = () => {
  return (
    <Layout title="Teacher Dashboard">
      <TeacherDashboard />
    </Layout>
  );
};

export default TeacherPage;