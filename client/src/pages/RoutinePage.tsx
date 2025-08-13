// /client/src/pages/RoutinePage.tsx

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../context/AuthContext';

import DashboardHeader from '../components/dashboard/DashboardHeader';
import Navbar from '../components/dashboard/Navbar';
import ClassRoutine from '../components/dashboard/ClassRoutine';
import DashboardFooter from '../components/common/DashboardFooter';

// Interface for course data used by the routine component
interface RoutineCourse {
  code: string;
  title: string;
  credits: number;
  schedule: { day: string; time: string; room: string }[];
}

const RoutinePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [routineData, setRoutineData] = useState<RoutineCourse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSemester, setCurrentSemester] = useState<string>('');

  useEffect(() => {
    if (!currentUser) return;

    const fetchRoutineData = async () => {
      setLoading(true);

      // Fetch all enrollments for the current user, ordered by semester
      const enrollmentsRef = collection(db, "users", currentUser.uid, "enrollments");
      const enrollmentsQuery = query(enrollmentsRef, orderBy("semester", "desc"));
      const enrollmentsSnap = await getDocs(enrollmentsQuery);
      const allEnrollments = enrollmentsSnap.docs.map(d => d.data());

      // Determine the most recent semester
      const latestSemester = allEnrollments.length > 0 ? allEnrollments[0].semester : null;
      setCurrentSemester(latestSemester || 'N/A');

      if (latestSemester) {
        // Filter enrollments to get only the courses for the current semester
        const currentRoutineCourses = allEnrollments
          .filter(e => e.semester === latestSemester)
          .map(e => ({
            code: e.courseId,
            title: e.courseDetails.title,
            credits: e.courseDetails.credits,
            schedule: e.courseDetails.schedule || [], // Ensure schedule is an array
          }));
        setRoutineData(currentRoutineCourses);
      }

      setLoading(false);
    };

    fetchRoutineData();
  }, [currentUser]);

  if (loading || !currentUser) {
    return <div className="min-h-screen flex items-center justify-center bg-dark-primary text-white">Loading Routine...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-primary">
      <DashboardHeader userName={currentUser.displayName!} userId={currentUser.customId} />
      <Navbar activeItem="Routine" /> {/* Set the active navbar item */}

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-light-primary">
            Class Routine - <span className="text-gradient-blue-cyan">{currentSemester}</span>
          </h1>
          <p className="text-light-tertiary mt-1">Your weekly class schedule for the current semester.</p>
        </div>

        {routineData && routineData.length > 0 ? (
          <ClassRoutine courses={routineData} />
        ) : (
          <div className="bg-dark-secondary shadow-xl rounded-lg p-12 border border-dark-tertiary text-center">
            <h3 className="text-lg font-semibold text-light-primary">No Routine Found</h3>
            <p className="text-light-tertiary mt-2">There is no class routine available for the current semester.</p>
          </div>
        )}
      </main>

      <DashboardFooter />
    </div>
  );
};

export default RoutinePage;