import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import Navbar, { type ActiveNavItems } from '../components/dashboard/Navbar';
import UserProfileCard from '../components/dashboard/UserProfileCard';
import FacultyAdvisorCard from '../components/dashboard/FacultyAdvisorCard';
import DashboardFooter from '../components/common/DashboardFooter';
import DegreeProgressTracker from '../components/dashboard/DegreeProgressTracker';

const DashboardPage: React.FC = () => {
  // Static data for user profile
  const userData = {
    userName: "Samiyeel Alim Binaaf",
    userId: "2212779042",
    userEmail: "samiyeel.binaaf@northsouth.edu",
    degree: "BS in CSE",
    curriculum: "BS in CSE - 130 Credit",
    avatarUrl: "https://rds3.northsouth.edu/assets/images/avatars/profile-pic.jpg",
  };

  // Static data for faculty advisor
  const advisorData = {
    advisorId: "TNS1",
    room: "SAC8XX",
    name: "Tanzilah Noor Shabnam",
    email: "tanzilah.shabnam@northsouth.edu",
  };

  // Static data for the degree progress tracker
  const degreeProgressData = {
    totalCredits: 130,
    completedCredits: 42,
    completedCourses: [
      { code: 'CSE115', title: 'Programming Language I', credits: 3 },
      { code: 'CSE115L', title: 'Programming Language I Lab', credits: 1 },
      { code: 'CSE173', title: 'Discrete Mathematics', credits: 3 },
      { code: 'CSE215', title: 'Programming Language II', credits: 3 },
      { code: 'CSE215L', title: 'Programming Language II Lab', credits: 1 },
      { code: 'PHY107', title: 'Physics I', credits: 3 },
      { code: 'ENG102', title: 'Introduction to Composition', credits: 3 },
      { code: 'MAT120', title: 'Calculus I', credits: 3 },
    ],
    remainingCourses: [
      { code: 'CSE225', title: 'Data Structures & Algorithms', credits: 3 },
      { code: 'CSE231', title: 'Digital Logic Design', credits: 3 },
      { code: 'CSE299', title: 'Junior Design Project', credits: 3 },
      { code: 'CSE311', title: 'Database Systems', credits: 3 },
      { code: 'CSE327', title: 'Software Engineering', credits: 3 },
      { code: 'CSE332', title: 'Computer Organization', credits: 3 },
      { code: 'CSE373', title: 'Design & Analysis of Algorithms', credits: 3 },
    ],
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
          {/* Left Column: User Profile */}
          <div className="lg:col-span-1">
            <UserProfileCard {...userData} />
          </div>

          {/* Right Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <FacultyAdvisorCard advisor={advisorData} />
            <DegreeProgressTracker {...degreeProgressData} />
          </div>
        </div>
      </main>
      
      <DashboardFooter />
    </div>
  );
};

export default DashboardPage;