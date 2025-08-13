// /client/src/pages/GradeDisputePage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../context/AuthContext';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import Navbar from '../components/dashboard/Navbar';
import DashboardFooter from '../components/common/DashboardFooter';
import GradeDisputeForm from '../components/dashboard/GradeDisputeForm';
import GradeDisputeTracker, { type Dispute } from '../components/dashboard/GradeDisputeTracker';

interface GradedCourse {
  courseId: string;
  courseTitle: string;
  semester: string;
  grade: string;
}

const GradeDisputePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [gradedCourses, setGradedCourses] = useState<GradedCourse[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // ✅ State to trigger data refetch

  // ✅ This useEffect now handles all data fetching and runs ONLY when currentUser or the trigger changes.
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Fetch enrollments
        const enrollmentsRef = collection(db, "users", currentUser.uid, "enrollments");
        const enrollmentsSnap = await getDocs(enrollmentsRef);
        const courses = (enrollmentsSnap?.docs || [])
          .map(doc => doc.data())
          .filter(e => e.grade !== 'IP' && e.grade)
          .map(e => ({
            courseId: e.courseId,
            courseTitle: e.courseDetails.title,
            semester: e.semester,
            grade: e.grade,
          }));
        setGradedCourses(courses);

        // Fetch existing disputes
        const disputesRef = collection(db, "gradeDisputes");
        const q = query(disputesRef, where("studentUid", "==", currentUser.uid));
        const disputesSnap = await getDocs(q);
        const disputesData = (disputesSnap?.docs || []).map(doc => ({ id: doc.id, ...doc.data() } as Dispute));
        setDisputes(disputesData);

      } catch (error) {
          console.error("Failed to fetch data:", error);
      } finally {
          setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, refreshTrigger]); // Dependency array is now stable and won't cause a loop

  const handleDisputeSubmit = async (disputeData: any) => {
    if (!currentUser) throw new Error("User not authenticated.");

    const newDispute = {
      ...disputeData,
      studentUid: currentUser.uid,
      studentId: currentUser.customId,
      status: 'Submitted',
      submittedAt: serverTimestamp(),
      facultyId: currentUser.profile.advisorId,
      resolutionDetails: null,
      resolvedAt: null,
    };

    await addDoc(collection(db, 'gradeDisputes'), newDispute);
    
    // ✅ Instead of calling a function, just update the trigger state to cause the useEffect to run again.
    setRefreshTrigger(prev => prev + 1);
  };
  
  if (loading || !currentUser) {
    return <div className="min-h-screen flex items-center justify-center bg-dark-primary text-white">Loading Grade Disputes...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-primary">
      <DashboardHeader userName={currentUser.displayName!} userId={currentUser.customId} />
      <Navbar activeItem="Disputes" />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-light-primary">
                Grade Dispute Center
            </h1>
            <p className="text-light-tertiary mt-1">Submit a new dispute or track the status of existing ones.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-1">
                <GradeDisputeForm gradedCourses={gradedCourses} onSubmit={handleDisputeSubmit} />
            </div>
            <div className="lg:col-span-1">
                <GradeDisputeTracker disputes={disputes} />
            </div>
        </div>
      </main>
      <DashboardFooter />
    </div>
  );
};

export default GradeDisputePage;