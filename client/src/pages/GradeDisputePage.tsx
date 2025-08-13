// /client/src/pages/DashboardPage.tsx

import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../context/AuthContext';

import DashboardHeader from '../components/dashboard/DashboardHeader';
import Navbar from '../components/dashboard/Navbar';
import UserProfileCard from '../components/dashboard/UserProfileCard';
import FacultyAdvisorCard from '../components/dashboard/FacultyAdvisorCard';
import DashboardFooter from '../components/common/DashboardFooter';
import CourseGrades from '../components/dashboard/CourseGrades';
import ClassRoutine from '../components/dashboard/ClassRoutine';
import AttendanceSummary from '../components/dashboard/AttendanceSummary';

// --- Interfaces for Data Structures ---
interface Schedule {
  day: string;
  time: string;
  room: string;
}
interface GradeRecord {
  code: string;
  title: string;
  credits: number;
  grade: string;
}
interface SemesterData {
  semester: string;
  gpa: string;
  courses: GradeRecord[];
}
interface AttendanceRecord {
  courseId: string;
  courseTitle: string;
  summary: { present: number; absent: number; total: number; };
}
interface SemesterAttendance {
  semester: string;
  records: AttendanceRecord[];
}
interface Advisor {
  advisorId: string;
  room: string;
  name: string;
  email: string;
}

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

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  
  const [advisorData, setAdvisorData] = useState<Advisor | null>(null);
  const [semestersData, setSemestersData] = useState<SemesterData[] | null>(null);
  const [attendanceData, setAttendanceData] = useState<SemesterAttendance[] | null>(null);
  const [routineData, setRoutineData] = useState<any[] | null>(null);
  const [cgpa, setCgpa] = useState<string>('N/A');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      setLoading(true);

      if (currentUser.profile.advisorId) {
        const advisorRef = doc(db, "faculty", currentUser.profile.advisorId);
        const advisorSnap = await getDoc(advisorRef);
        if (advisorSnap.exists()) setAdvisorData(advisorSnap.data() as Advisor);
      }

      const enrollmentsRef = collection(db, "users", currentUser.uid, "enrollments");
      const enrollmentsQuery = query(enrollmentsRef, orderBy("semester", "desc"));
      const enrollmentsSnap = await getDocs(enrollmentsQuery);
      const allEnrollments = enrollmentsSnap.docs.map(d => d.data());

      const allGradedCourses = allEnrollments
            .filter(e => e.grade !== 'IP' && e.grade)
            .map(e => ({ ...e.courseDetails, grade: e.grade, code: e.courseId }));

      const semesterMap: { [key: string]: GradeRecord[] } = {};
      allEnrollments.forEach(e => {
          if (!semesterMap[e.semester]) semesterMap[e.semester] = [];
          semesterMap[e.semester].push({ ...e.courseDetails, grade: e.grade, code: e.courseId });
      });
      const structuredSemesters = Object.entries(semesterMap)
        .map(([semester, courses]) => ({ semester, courses, gpa: calculateGPA(courses) }))
        .sort((a, b) => b.semester.localeCompare(a.semester));
      setSemestersData(structuredSemesters);
      setCgpa(calculateGPA(allGradedCourses));

      const attendanceSemesterMap: { [key: string]: AttendanceRecord[] } = {};
      allEnrollments.forEach(e => {
        if (!attendanceSemesterMap[e.semester]) attendanceSemesterMap[e.semester] = [];
        attendanceSemesterMap[e.semester].push({
          courseId: e.courseId,
          courseTitle: e.courseDetails.title,
          summary: e.attendanceSummary || { present: 0, absent: 0, total: 0 }
        });
      });
      const structuredAttendance = Object.entries(attendanceSemesterMap)
        .map(([semester, records]) => ({ semester, records }))
        .sort((a, b) => b.semester.localeCompare(a.semester));
      setAttendanceData(structuredAttendance);
      
      const latestSemester = structuredSemesters.length > 0 ? structuredSemesters[0].semester : null;
      if (latestSemester) {
          const currentRoutineCourses = allEnrollments
              .filter(e => e.semester === latestSemester)
              .map(e => ({ code: e.courseId, ...e.courseDetails }));
          setRoutineData(currentRoutineCourses);
      }

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
      <Navbar activeItem="Home" />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-light-primary">
            Welcome, <span className="text-gradient-pink-orange">{currentUser.displayName}</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <UserProfileCard
              userName={currentUser.displayName!}
              userId={currentUser.customId}
              userEmail={currentUser.email!}
              degree={currentUser.profile.degree}
              curriculum={currentUser.profile.curriculum}
              avatarUrl={currentUser.profile.avatarUrl}
            />
            {advisorData && <FacultyAdvisorCard advisor={advisorData} />}
          </div>

          <div className="lg:col-span-2 space-y-8">
            {routineData && <ClassRoutine courses={routineData} />}
            {attendanceData && <AttendanceSummary semesters={attendanceData} />}
            {semestersData && cgpa && <CourseGrades semesters={semestersData} cgpa={cgpa} />}
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default DashboardPage;