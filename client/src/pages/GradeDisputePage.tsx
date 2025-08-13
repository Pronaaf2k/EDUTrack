// /client/src/pages/GradeDisputePage.tsx

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore'; // Removed orderBy
import { db } from '../firebase-config';
import { useAuth } from '../context/AuthContext';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import Navbar from '../components/dashboard/Navbar';
import DashboardFooter from '../components/common/DashboardFooter';
import GradeDisputeForm from '../components/dashboard/GradeDisputeForm';
import GradeDisputeTracker, { type Dispute } from '../components/dashboard/GradeDisputeTracker';

// Interface for a course that can be disputed
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

  // Function to fetch all necessary data for this page
  const fetchData = async () => {
    if (!currentUser) return;
    setLoading(true);

    // 1. Fetch user's enrollments to populate the course selection dropdown
    const enrollmentsRef = collection(db, "users", currentUser.uid, "enrollments");
    const enrollmentsSnap = await getDocs(enrollmentsRef);
    const courses = enrollmentsSnap.docs
      .map(doc => doc.data())
      .filter(e => e.grade !== 'IP' && e.grade) // Only allow completed courses to be disputed
      .map(e => ({
        courseId: e.courseId,
        courseTitle: e.courseDetails.title,
        semester: e.semester,
        grade: e.grade,
      }));
    setGradedCourses(courses);

    // 2. Fetch existing grade disputes for this user (WITHOUT sorting)
    const disputesRef = collection(db, "gradeDisputes");
    // --- MODIFICATION: The orderBy clause has been removed from this query ---
    const q = query(disputesRef, where("studentUid", "==", currentUser.uid));
    const disputesSnap = await getDocs(q);
    
    // Note: The order of disputes will now be unpredictable.
    const disputesData = disputesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dispute));
    setDisputes(disputesData);

    setLoading(false);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [currentUser]);

  // Handler for submitting a new dispute
  const handleDisputeSubmit = async (disputeData: any) => {
    if (!currentUser) throw new Error("User not authenticated.");

    const newDispute = {
      ...disputeData,
      studentUid: currentUser.uid,
      studentId: currentUser.customId,
      status: 'Submitted',
      submittedAt: serverTimestamp(),
      facultyId: currentUser.profile.advisorId, // Assign to current advisor
      resolutionDetails: null,
      resolvedAt: null,
    };

    await addDoc(collection(db, 'gradeDisputes'), newDispute);
    
    // Refresh the list of disputes after submission
    fetchData(); 
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