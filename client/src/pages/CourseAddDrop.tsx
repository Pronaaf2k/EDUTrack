// /client/src/pages/CourseAddDrop.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import Navbar from '../components/dashboard/Navbar';
import DashboardFooter from '../components/common/DashboardFooter';
import CourseAddDropCard from '../components/dashboard/CourseAddDropCard';

// Dummy data for demonstration
const allCourses = [
  { code: 'CSE327', title: 'Software Engineering', credits: 3, schedule: { day: 'Monday', time: '02:00 PM - 03:30 PM', room: 'NAC601' } },
  { code: 'CSE331', title: 'Microprocessor Interfacing', credits: 3, schedule: { day: 'Tuesday', time: '11:20 AM - 12:50 PM', room: 'SAC405' } },
  { code: 'CSE373', title: 'Design and Analysis of Algorithms', credits: 3, schedule: { day: 'Wednesday', time: '09:40 AM - 11:10 AM', room: 'NAC209' } },
  { code: 'CSE411', title: 'Advanced Database Management Systems', credits: 3, schedule: { day: 'Thursday', time: '03:40 PM - 05:10 PM', room: 'LIB608' } },
];

const initialRegistered = ['CSE327']; // Initially, the user is registered for one course

const CourseAddDrop: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [availableCourses, setAvailableCourses] = useState<typeof allCourses>([]);
  const [registeredCourses, setRegisteredCourses] = useState<typeof allCourses>([]);

  useEffect(() => {
    if (currentUser) {
      // Simulate fetching data
      setRegisteredCourses(allCourses.filter(c => initialRegistered.includes(c.code)));
      setAvailableCourses(allCourses.filter(c => !initialRegistered.includes(c.code)));
      setLoading(false);
    }
  }, [currentUser]);

  const handleAddCourse = (courseCode: string) => {
    const courseToAdd = availableCourses.find(c => c.code === courseCode);
    if (courseToAdd) {
      setRegisteredCourses([...registeredCourses, courseToAdd]);
      setAvailableCourses(availableCourses.filter(c => c.code !== courseCode));
      // Here you would typically call an API to update the backend
      alert(`${courseCode} has been added successfully!`);
    }
  };

  const handleDropCourse = (courseCode: string) => {
    const courseToDrop = registeredCourses.find(c => c.code === courseCode);
    if (courseToDrop) {
      setAvailableCourses([...availableCourses, courseToDrop]);
      setRegisteredCourses(registeredCourses.filter(c => c.code !== courseCode));
      // Here you would typically call an API to update the backend
      alert(`${courseCode} has been dropped successfully!`);
    }
  };
  
  if (loading || !currentUser) {
    return <div className="min-h-screen flex items-center justify-center bg-dark-primary text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-primary">
      <DashboardHeader userName={currentUser.displayName!} userId={currentUser.customId} />
      <Navbar activeItem="Services" />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-light-primary">
            Course Registration (Add/Drop)
          </h1>
          <p className="text-light-tertiary mt-1">Manage your course selection for the upcoming semester.</p>
        </div>
        
        <CourseAddDropCard 
            availableCourses={availableCourses}
            registeredCourses={registeredCourses}
            onAdd={handleAddCourse}
            onDrop={handleDropCourse}
        />
      </main>

      <DashboardFooter />
    </div>
  );
};

export default CourseAddDrop;