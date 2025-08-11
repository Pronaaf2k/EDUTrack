import React from 'react';
import { CheckCircleIcon, ListBulletIcon } from '@heroicons/react/24/outline';

// Define the structure for a single course
interface Course {
  code: string;
  title: string;
  credits: number;
}

// Define the props for the DegreeProgressTracker component
interface DegreeProgressProps {
  completedCourses: Course[];
  remainingCourses: Course[];
  totalCredits: number;
  completedCredits: number;
}

const DegreeProgressTracker: React.FC<DegreeProgressProps> = ({
  completedCourses,
  remainingCourses,
  totalCredits,
  completedCredits,
}) => {
  // Calculate the completion percentage for the progress bar
  const progressPercentage = totalCredits > 0 ? (completedCredits / totalCredits) * 100 : 0;

  return (
    <div className="bg-dark-secondary shadow-xl rounded-lg p-6 border border-dark-tertiary">
      <h3 className="text-lg font-semibold text-light-primary mb-6 border-b border-dark-tertiary pb-3">
        Degree Progress Tracker
      </h3>

      {/* Progress Bar Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1 text-sm">
          <span className="font-medium text-light-secondary">Credit Completion</span>
          <span className="font-bold text-light-primary">
            {completedCredits} / {totalCredits} Credits
          </span>
        </div>
        <div className="w-full bg-dark-primary rounded-full h-2.5 shadow-inner">
          <div
            className="bg-gradient-to-r from-brand-lime to-brand-cyan h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Columns for Completed and Remaining Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completed Courses Column */}
        <div>
          <h4 className="flex items-center text-md font-semibold text-brand-lime mb-3">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Completed Courses ({completedCourses.length})
          </h4>
          <div className="bg-dark-primary/30 rounded-md p-3 max-h-60 overflow-y-auto">
            <ul className="space-y-2 text-xs">
              {completedCourses.map((course) => (
                <li key={course.code} className="flex justify-between items-center text-light-secondary p-2 rounded-md hover:bg-dark-tertiary/50">
                  <span>
                    <b className="font-semibold text-light-primary">{course.code}</b>: {course.title}
                  </span>
                  <span className="font-medium bg-dark-tertiary/80 text-brand-lime py-0.5 px-2 rounded-md">
                    {course.credits} Cr
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Remaining Courses Column */}
        <div>
          <h4 className="flex items-center text-md font-semibold text-brand-orange mb-3">
            <ListBulletIcon className="h-5 w-5 mr-2" />
            Remaining Courses ({remainingCourses.length})
          </h4>
          <div className="bg-dark-primary/30 rounded-md p-3 max-h-60 overflow-y-auto">
            <ul className="space-y-2 text-xs">
              {remainingCourses.map((course) => (
                <li key={course.code} className="flex justify-between items-center text-light-secondary p-2 rounded-md hover:bg-dark-tertiary/50">
                  <span>
                    <b className="font-semibold text-light-primary">{course.code}</b>: {course.title}
                  </span>
                   <span className="font-medium bg-dark-tertiary/80 text-brand-orange py-0.5 px-2 rounded-md">
                    {course.credits} Cr
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DegreeProgressTracker;