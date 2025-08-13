// /client/src/pages/DashboardPage.tsx

import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../context/AuthContext';
import { getCourseGradesData, type SemesterData } from '../firebase/grades';

import DashboardHeader from '../components/dashboard/DashboardHeader';
import Navbar, { type ActiveNavItems } from '../components/dashboard/Navbar';
import UserProfileCard from '../components/dashboard/UserProfileCard';
import FacultyAdvisorCard from '../components/dashboard/FacultyAdvisorCard';
import DashboardFooter from '../components/common/DashboardFooter';
import DegreeProgressTracker from '../components/dashboard/DegreeProgressTracker';
import CourseGrades from '../components/dashboard/CourseGrades';

interface Course {
  code: string;
  title: string;
  credits: number;
}

interface CourseDetails {
  title: string;
  credits: number;
}

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

  const [advisorData, setAdvisorData] = useState<Advisor | null>(null);
  const [degreeProgressData, setDegreeProgressData] = useState<any>(null);
  const [semestersData, setSemestersData] = useState<SemesterData[] | null>(null);
  const [cgpa, setCgpa] = useState<string>('N/A');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (currentUser.profile.advisorId) {
          const advisorRef = doc(db, "faculty", currentUser.profile.advisorId);
          const advisorSnap = await getDoc(advisorRef);
          if (advisorSnap.exists()) {
            setAdvisorData(advisorSnap.data() as Advisor);
          }
        }

        const enrollmentsRef = collection(db, "users", currentUser.uid, "enrollments");
        const enrollmentsQuery = query(enrollmentsRef, orderBy("semester", "desc"));
        const enrollmentsSnap = await getDocs(enrollmentsQuery);

        const allEnrolledCourses: Enrollment[] = enrollmentsSnap.docs.map(d => d.data() as Enrollment);

        const completedCourses: Course[] = allEnrolledCourses
          .filter(c => c.grade !== 'IP')
          .map(c => ({ code: c.courseId, ...c.courseDetails }));

        const completedCredits = completedCourses.reduce((sum, course) => sum + course.credits, 0);

        const remainingCourses: Course[] = allEnrolledCourses
          .filter(c => c.grade === 'IP')
          .map(c => ({ code: c.courseId, ...c.courseDetails }));

        // ADDED: Logic to group remaining courses by department
        const remainingCoursesByDept = remainingCourses.reduce((acc, course) => {
          const department = course.code.match(/^[a-zA-Z]+/)?.[0] || 'General';
          if (!acc[department]) {
            acc[department] = [];
          }
          acc[department].push(course);
          return acc;
        }, {} as { [key: string]: Course[] });

        // MODIFIED: Update the state with the new department-grouped structure
        setDegreeProgressData({
          totalCredits: 130, // This should eventually come from the curriculum data
          completedCredits: completedCredits,
          completedCourses: completedCourses,
          remainingCoursesByDept: remainingCoursesByDept, // Use the new grouped object
        });
        
        const gradesData = await getCourseGradesData(currentUser.uid);
        if (gradesData) {
          setSemestersData(gradesData.semesters);
          setCgpa(gradesData.cgpa);
        }

      } catch (error) {
          console.error("Failed to fetch dashboard data:", error)
      } finally {
          setLoading(false);
      }
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

          <div className="lg:col-span-2 space-y-8">
            {advisorData && <FacultyAdvisorCard advisor={advisorData} />}
            {degreeProgressData && <DegreeProgressTracker {...degreeProgressData} />}
            {semestersData && cgpa && (
              <CourseGrades semesters={semestersData} cgpa={cgpa} />
            )}
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default DashboardPage;