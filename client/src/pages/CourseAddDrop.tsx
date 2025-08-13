import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase'; 

const CourseAddDrop: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const courseList: any[] = [];
      querySnapshot.forEach((docSnap) => {
        courseList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setCourses(courseList);
    };

    fetchCourses();
  }, []);

  const handleAddCourse = async () => {
    if (!selectedCourse) return alert('Please select a course!');
    setLoading(true);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        enrolledCourses: arrayUnion(selectedCourse),
      });
      alert('Course added successfully!');
      setSelectedCourse('');
    } catch (error) {
      console.error(error);
      alert('Failed to add course.');
    } finally {
      setLoading(false);
    }
  };

  const handleDropCourse = async () => {
    if (!selectedCourse) return alert('Please select a course!');
    setLoading(true);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        enrolledCourses: arrayRemove(selectedCourse),
      });
      alert('Course dropped successfully!');
      setSelectedCourse('');
    } catch (error) {
      console.error(error);
      alert('Failed to drop course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary text-white flex flex-col items-center justify-center px-4">
      <div className="bg-dark-tertiary p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Course Add/Drop</h1>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={user?.name || ''}
            readOnly
            className="w-full bg-dark-primary border border-dark-secondary rounded px-3 py-2 text-white cursor-not-allowed"
          />
        </div>

        {/* ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">ID</label>
          <input
            type="text"
            value={user?.idNumber || ''}
            readOnly
            className="w-full bg-dark-primary border border-dark-secondary rounded px-3 py-2 text-white cursor-not-allowed"
          />
        </div>

        {/* Course Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Select Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full bg-dark-primary border border-dark-secondary rounded px-3 py-2 text-white"
          >
            <option value="">-- Choose a course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.id} - {course.title} ({course.credits} cr)
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            className="flex-1 bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold py-2 rounded"
            onClick={handleAddCourse}
            disabled={loading}
          >
            Add
          </button>
          <button
            type="button"
            className="flex-1 bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold py-2 rounded"
            onClick={handleDropCourse}
            disabled={loading}
          >
            Drop
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseAddDrop;
