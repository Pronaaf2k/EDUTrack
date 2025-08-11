import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import Navbar, { type ActiveNavItems } from '../components/dashboard/Navbar';
import UserProfileCard from '../components/dashboard/UserProfileCard';
import FacultyAdvisorCard from '../components/dashboard/FacultyAdvisorCard';
import DashboardFooter from '../components/common/DashboardFooter';

const DashboardPage: React.FC = () => {
  const userData = {
    userName: "Samiyeel Alim Binaaf",
    userId: "2212779042",
    userEmail: "samiyeel.binaaf@northsouth.edu",
    degree: "BS in CSE",
    curriculum: "BS in CSE - 130 Credit",
    avatarUrl: "https://rds3.northsouth.edu/assets/images/avatars/profile-pic.jpg",
  };

  const advisorData = {
    advisorId: "TNS1",
    room: "SAC8XX",
    name: "Tanzilah Noor Shabnam",
    email: "tanzilah.shabnam@northsouth.edu",
  };

  const [currentNavItem, setCurrentNavItem] = useState<ActiveNavItems>("Home");

  return (
    <div className="min-h-screen flex flex-col bg-dark-primary">
      <DashboardHeader userName={userData.userName} userId={userData.userId} />
      <Navbar activeItem={currentNavItem} />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-light-primary">
            Welcome, <span className="text-gradient-pink-orange">{userData.userName}</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <UserProfileCard {...userData} />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <FacultyAdvisorCard advisor={advisorData} />
            {/* Future modules like Degree Progress Tracker and Grades Viewer will go here */}
          </div>
        </div>
      </main>
      
      <DashboardFooter />
    </div>
  );
};

export default DashboardPage;