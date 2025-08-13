// /client/src/components/dashboard/GradeDisputeForm.tsx

import React, { useState } from 'react';

interface GradedCourse {
  courseId: string;
  courseTitle: string;
  semester: string;
  grade: string;
}

interface GradeDisputeFormProps {
  gradedCourses: GradedCourse[];
  onSubmit: (dispute: any) => Promise<void>;
}

const GradeDisputeForm: React.FC<GradeDisputeFormProps> = ({ gradedCourses, onSubmit }) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [expectedGrade, setExpectedGrade] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedCourse || !expectedGrade || !reason) {
      setError('All fields are required.');
      return;
    }

    setIsLoading(true);
    const courseData = gradedCourses.find(c => `${c.courseId}-${c.semester}` === selectedCourse);
    
    if (!courseData) {
      setError('Invalid course selected.');
      setIsLoading(false);
      return;
    }

    try {
      await onSubmit({
        courseId: courseData.courseId,
        semester: courseData.semester,
        currentGrade: courseData.grade,
        expectedGrade,
        reason
      });
      setSuccess('Your grade dispute has been submitted successfully!');
      // Reset form
      setSelectedCourse('');
      setExpectedGrade('');
      setReason('');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-dark-secondary shadow-xl rounded-lg p-6 border border-dark-tertiary">
      <h3 className="text-lg font-semibold text-light-primary mb-4">Submit a New Grade Dispute</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-center text-red-300 bg-red-900/50 p-3 rounded-md text-sm">{error}</p>}
        {success && <p className="text-center text-lime-300 bg-lime-900/50 p-3 rounded-md text-sm">{success}</p>}
        
        <div>
          <label htmlFor="course" className="block text-sm font-medium text-light-secondary mb-1">
            Select Course
          </label>
          <select
            id="course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="block w-full pl-3 pr-10 py-3 bg-dark-tertiary border border-dark-tertiary/50 rounded-md text-light-primary focus:outline-none focus:ring-brand-cyan sm:text-sm"
          >
            <option value="">-- Select a course --</option>
            {gradedCourses.map(c => (
              <option key={`${c.courseId}-${c.semester}`} value={`${c.courseId}-${c.semester}`}>
                {c.courseId}: {c.courseTitle} ({c.semester}) - Grade: {c.grade}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="expectedGrade" className="block text-sm font-medium text-light-secondary mb-1">
            Expected Grade
          </label>
          <input
            type="text"
            id="expectedGrade"
            value={expectedGrade}
            onChange={(e) => setExpectedGrade(e.target.value)}
            className="block w-full pl-3 pr-3 py-3 bg-dark-tertiary border border-dark-tertiary/50 rounded-md text-light-primary placeholder-light-tertiary focus:outline-none focus:ring-brand-cyan sm:text-sm"
            placeholder="e.g., A+"
          />
        </div>
        
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-light-secondary mb-1">
            Reason for Dispute
          </label>
          <textarea
            id="reason"
            rows={5}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="block w-full pl-3 pr-3 py-3 bg-dark-tertiary border border-dark-tertiary/50 rounded-md text-light-primary placeholder-light-tertiary focus:outline-none focus:ring-brand-cyan sm:text-sm"
            placeholder="Please provide a detailed explanation for your dispute..."
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-dark-primary bg-gradient-to-r from-brand-pink to-brand-orange hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-secondary focus:ring-brand-orange transition duration-150 disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Submit Dispute'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GradeDisputeForm;