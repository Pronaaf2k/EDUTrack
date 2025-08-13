// /client/src/pages/DashboardPage.tsx

import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../context/AuthContext';
// ADDED: Import the new grades API function and its types
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

// REMOVED: This interface is now handled in grades.ts
// interface GradeRecord { ... }

// REMOVED: This interface is now handled in grades.ts
// interface SemesterData { ... }

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

// COMMENTED OUT: This helper function has been moved to grades.ts
/*
const calculateGPA = (courses: GradeRecord[]): string => {
    const gradePoints: { [key: string]: number } = {
        'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0,
    };

    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        if (gradePoints[course.grade] !== undefined) {
            totalPoints += gradePoints[course.grade] * course.credits;
            totalCredits += course.credits;
        }
    });

    if (totalCredits === 0) return 'N/A';
    return (totalPoints / totalCredits).toFixed(2);
};
*/


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
      try { // ADDED: try block for better error handling
        // 1. Fetch Faculty Advisor Data
        if (currentUser.profile.advisorId) {
          const advisorRef = doc(db, "faculty", currentUser.profile.advisorId);
          const advisorSnap = await getDoc(advisorRef);
          if (advisorSnap.exists()) {
            setAdvisorData(advisorSnap.data() as Advisor);
          }
        }

        // 2. Fetch Degree Progress and Course Grades Data (Enrollments)
        const enrollmentsRef = collection(db, "users", currentUser.uid, "enrollments");
        const enrollmentsQuery = query(enrollmentsRef, orderBy("semester", "desc"));
        const enrollmentsSnap = await getDocs(enrollmentsQuery);

        const allEnrolledCourses: Enrollment[] = enrollmentsSnap.docs.map(d => d.data() as Enrollment);

        // --- Logic for Degree Progress Tracker ---
        const completedCourses: Course[] = allEnrolledCourses
          .filter(c => c.grade !== 'IP') // 'IP' for 'In Progress'
          .map(c => ({ code: c.courseId, ...c.courseDetails }));

        const completedCredits = completedCourses.reduce((sum, course) => sum + course.credits, 0);

        const remainingCourses: Course[] = allEnrolledCourses
          .filter(c => c.grade === 'IP')
          .map(c => ({ code: c.courseId, ...c.courseDetails }));

        setDegreeProgressData({
          totalCredits: 130,
          completedCredits: completedCredits,
          completedCourses: completedCourses,
          remainingCourses: remainingCourses,
        });

        // COMMENTED OUT: Old grade calculation logic
        /*
        // --- Logic for Course Grades Component ---
        const semesterMap: { [key: string]: GradeRecord[] } = {};
        allEnrolledCourses.forEach(c => {
            if (!semesterMap[c.semester]) {
                semesterMap[c.semester] = [];
            }
            semesterMap[c.semester].push({
                code: c.courseId,
                title: c.courseDetails.title,
                credits: c.courseDetails.credits,
                grade: c.grade,
            });
        });

        const structuredSemesters: SemesterData[] = Object.entries(semesterMap).map(([semester, courses]) => ({
            semester,
            courses,
            gpa: calculateGPA(courses),
        })).sort((a, b) => b.semester.localeCompare(a.semester)); 

        if(structuredSemesters.length > 0) {
          setSemestersData(structuredSemesters);

          const allGradedCourses = allEnrolledCourses
              .filter(c => c.grade !== 'IP')
              .map(c => ({
                  code: c.courseId,
                  title: c.courseDetails.title,
                  credits: c.courseDetails.credits,
                  grade: c.grade
              }));
          setCgpa(calculateGPA(allGradedCourses));
        }
        */

        // ADDED: New logic to fetch and set grades data using the API
        const gradesData = await getCourseGradesData(currentUser.uid);
        if (gradesData) {
          setSemestersData(gradesData.semesters);
          setCgpa(gradesData.cgpa);
        }

      } catch (error) { // ADDED: catch block
          console.error("Failed to fetch dashboard data:", error)
      } finally { // ADDED: finally block
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
          <div className="lg-col-span-1">
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