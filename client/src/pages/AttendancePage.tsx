// /client/src/pages/AttendancePage.tsx

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../context/AuthContext';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import Navbar from '../components/dashboard/Navbar';
import AttendanceSummary from '../components/dashboard/AttendanceSummary';
import DashboardFooter from '../components/common/DashboardFooter';

// Interface for attendance data as expected by the AttendanceSummary component
interface AttendanceRecord {
  courseId: string;
  courseTitle: string;
  summary: {
    present: number;
    absent: number;
    total: number;
  };
}

interface SemesterAttendance {
  semester: string;
  records: AttendanceRecord[];
}

const AttendancePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [attendanceData, setAttendanceData] = useState<SemesterAttendance[] | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Synthetic Data Generation ---
  const generateSyntheticData = (): SemesterAttendance[] => {
    const semesters = ["Spring 2025", "Summer 2025", "Fall 2025"];
    const courses = [
      { id: "CSE115", title: "Programming Language I" },
      { id: "CSE173", title: "Discrete Mathematics" },
      { id: "PHY107", title: "Physics I" },
      { id: "ENG102", title: "Introduction to Composition" },
      { id: "MAT120", title: "Calculus I" },
    ];

    return semesters.map(semester => {
      const records: AttendanceRecord[] = courses.map(course => {
        const total = Math.floor(Math.random() * (24 - 18 + 1)) + 18; // Total classes between 18 and 24
        const present = Math.floor(Math.random() * (total - 10 + 1)) + 10; // Present between 10 and total
        const absent = total - present;
        return {
          courseId: course.id,
          courseTitle: course.title,
          summary: {
            present,
            absent,
            total,
          },
        };
      });
      return { semester, records };
    });
  };


  useEffect(() => {
    if (!currentUser) return;

    const fetchAttendanceData = async () => {
      setLoading(true);

      const enrollmentsRef = collection(db, "users", currentUser.uid, "enrollments");
      const enrollmentsQuery = query(enrollmentsRef, orderBy("semester", "desc"));
      const enrollmentsSnap = await getDocs(enrollmentsQuery);

      if (enrollmentsSnap.empty) {
        // If no data, use synthetic data
        setAttendanceData(generateSyntheticData());
      } else {
        const semesterMap: { [key: string]: AttendanceRecord[] } = {};

        enrollmentsSnap.docs.forEach(doc => {
          const enrollment = doc.data();
          if (!semesterMap[enrollment.semester]) {
            semesterMap[enrollment.semester] = [];
          }
          semesterMap[enrollment.semester].push({
            courseId: enrollment.courseId,
            courseTitle: enrollment.courseDetails.title,
            summary: enrollment.attendanceSummary || { present: 0, absent: 0, total: 0 },
          });
        });

        const structuredData = Object.entries(semesterMap).map(([semester, records]) => ({
          semester,
          records,
        })).sort((a, b) => b.semester.localeCompare(a.semester));

        setAttendanceData(structuredData);
      }
      setLoading(false);
    };

    fetchAttendanceData();
  }, [currentUser]);

  if (loading || !currentUser) {
    return <div className="min-h-screen flex items-center justify-center bg-dark-primary text-white">Loading Attendance Data...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-primary">
      <DashboardHeader userName={currentUser.displayName!} userId={currentUser.customId} />
      <Navbar activeItem="Attendance" />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-light-primary">
            Attendance Records
          </h1>
          <p className="text-light-tertiary mt-1">View your attendance summary across different semesters.</p>
        </div>

        {attendanceData && attendanceData.length > 0 ? (
          <AttendanceSummary semesters={attendanceData} />
        ) : (
          <div className="bg-dark-secondary shadow-xl rounded-lg p-12 border border-dark-tertiary text-center">
            <h3 className="text-lg font-semibold text-light-primary">No Attendance Data Found</h3>
            <p className="text-light-tertiary mt-2">Could not fetch or generate attendance records.</p>
          </div>
        )}
      </main>

      <DashboardFooter />
    </div>
  );
};

export default AttendancePage;