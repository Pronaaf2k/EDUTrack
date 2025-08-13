import React from 'react';
import DashboardHeader from '../dashboard/DashboardHeader';

const DashboardPage = () => {
  const userName = 'Samiyheel Alim Binaaf';
  const userId = '2212779042';

  return (
    <div>
      <DashboardHeader userName={userName} userId={userId} />
      
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold">Welcome to Your Dashboard</h2>
        <p className="text-lg">Here you can access your courses, grades, and more.</p>
      </div>
    </div>
  );
};

export default DashboardPage;