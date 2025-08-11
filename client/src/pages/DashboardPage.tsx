// /client/src/pages/DashboardPage.tsx

import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../context/AuthContext';

import DashboardHeader from '../components/dashboard/DashboardHeader';
import Navbar, { type ActiveNavItems } from '../components/dashboard/Navbar';
import UserProfileCard from '../components/dashboard/UserProfileCard';
import FacultyAdvisorCard from '../components/dashboard/FacultyAdvisorCard';
import DashboardFooter from '../components/common/DashboardFooter';
import DegreeProgressTracker from '../components/dashboard/DegreeProgressTracker';

// The 'Course' type is what the DegreeProgressTracker component expects
interface Course {
  code: string;
  title: string;
  credits: number;
}

// **FIX:** This interface now accurately represents the course data nested in an enrollment document
interface CourseDetails {
  title: string;
  credits: number;
}

// **FIX:** The Enrollment interface now uses the correct 'CourseDetails' type
interface Enrollment {
  courseId: string;
  semester: string;
  grade: string;
  courseDetails: CourseDetails; 
}

interface Advisor {
  advisorId: string;
  room: string;
  name: string;
  email: string;
}

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentNavItem, setCurrentNavItem] = useState<ActiveNavItems>("Home");

  // State for our dynamic data
  const [advisorData, setAdvisorData] = useState<Advisor | null>(null);
  const [degreeProgressData, setDegreeProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      setLoading(true);
      
      // 1. Fetch Faculty Advisor Data
      if (currentUser.profile.advisorId) {
        const advisorRef = doc(db, "faculty", currentUser.profile.advisorId);
        const advisorSnap = await getDoc(advisorRef);
        if (advisorSnap.exists()) {
          setAdvisorData(advisorSnap.data() as Advisor);
        }
      }

      // 2. Fetch Degree Progress Data (Enrollments)
      const enrollmentsRef = collection(db, "users", currentUser.uid, "enrollments");
      const enrollmentsQuery = query(enrollmentsRef, orderBy("semester", "desc"));
      const enrollmentsSnap = await getDocs(enrollmentsQuery);
      
      const allEnrolledCourses: Enrollment[] = enrollmentsSnap.docs.map(d => d.data() as Enrollment);
      
      // **NO CHANGE HERE:** This logic is now valid because the types above are correct
      const completedCourses: Course[] = allEnrolledCourses
        .filter(c => c.grade !== 'IP') // 'IP' for 'In Progress'
        .map(c => ({ code: c.courseId, ...c.courseDetails }));
      
      const completedCredits = completedCourses.reduce((sum, course) => sum + course.credits, 0);

      // This is a simplified version. A real app would get remaining courses from a full curriculum plan.
      // For now, we'll just show the "in progress" courses as remaining.
      const remainingCourses: Course[] = allEnrolledCourses
        .filter(c => c.grade === 'IP')
        .map(c => ({ code: c.courseId, ...c.courseDetails }));

      setDegreeProgressData({
        totalCredits: 130, // This could also be stored in the user's profile
        completedCredits: completedCredits,
        completedCourses: completedCourses,
        remainingCourses: remainingCourses,
      });

      setLoading(false);
    };

    fetchData();
  }, [currentUser]);

  if (loading || !currentUser) {
    return <div className="min-h-screen flex items-center justify-center bg-dark-primary text-white">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-primary">
      <DashboardHeader userName={currentUser.displayName!} userId={currentUser.customId} />
      <Navbar activeItem={currentNavItem} />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-light-primary">
            Welcome, <span className="text-gradient-pink-orange">{currentUser.displayName}</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: User Profile */}
          <div className="lg:col-span-1">
            <UserProfileCard 
              userName={currentUser.displayName!}
              userId={currentUser.customId}
              userEmail={currentUser.email!}
              degree={currentUser.profile.degree}
              curriculum={currentUser.profile.curriculum}
              avatarUrl={currentUser.profile.avatarUrl}
            />
          </div>

          {/* Right Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {advisorData && <FacultyAdvisorCard advisor={advisorData} />}
            {degreeProgressData && <DegreeProgressTracker {...degreeProgressData} />}
          </div>
        </div>
      </main>
      
      <DashboardFooter />
    </div>
  );
};

export default DashboardPage;