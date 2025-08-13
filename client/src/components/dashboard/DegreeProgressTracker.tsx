// client/src/components/dashboard/DegreeProgressTracker.tsx

import React from 'react';
import { CheckCircleIcon, ListBulletIcon } from '@heroicons/react/24/outline';

interface Course {
  code: string;
  title: string;
  credits: number;
}

interface DegreeProgressProps {
  completedCourses: Course[];
  remainingCoursesByDept: { [department: string]: Course[] };
  totalCredits: number;
  completedCredits: number;
}

const DegreeProgressTracker: React.FC<DegreeProgressProps> = ({
  completedCourses,
  remainingCoursesByDept,
  totalCredits,
  completedCredits,
}) => {
  const progressPercentage = totalCredits > 0 ? (completedCredits / totalCredits) * 100 : 0;

  // FIX: Use the Nullish Coalescing Operator (??) to provide a safe fallback.
  // This ensures that even if `remainingCoursesByDept` is null or undefined,
  // we use an empty object `{}` for our calculations, preventing the crash.
  const safeRemainingByDept = remainingCoursesByDept ?? {};

  const remainingCoursesCount = Object.values(safeRemainingByDept).reduce(
    (acc, courses) => acc + (courses?.length || 0), 0
  );

  return (
    <div className="bg-dark-secondary shadow-xl rounded-lg p-6 border border-dark-tertiary">
      <h3 className="text-lg font-semibold text-light-primary mb-6 border-b border-dark-tertiary pb-3">
        Degree Progress Tracker
      </h3>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Completed Courses Section */}
        <div>
          <h4 className="flex items-center text-md font-semibold text-brand-lime mb-3">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Completed Courses ({(completedCourses || []).length})
          </h4>
          <div className="bg-dark-primary/30 rounded-md p-3 max-h-80 overflow-y-auto">
            <ul className="space-y-2 text-xs">
              {(completedCourses || []).map((course) => (
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

        {/* Remaining Courses Section */}
        <div>
          <h4 className="flex items-center text-md font-semibold text-brand-orange mb-3">
            <ListBulletIcon className="h-5 w-5 mr-2" />
            Remaining Courses ({remainingCoursesCount})
          </h4>
          <div className="bg-dark-primary/30 rounded-md p-3 max-h-80 overflow-y-auto space-y-4">
            {/* FIX: Map over the safe, default-guarded object */}
            {Object.entries(safeRemainingByDept).sort(([deptA], [deptB]) => deptA.localeCompare(deptB)).map(([department, courses]) => (
              <div key={department}>
                <p className="font-bold text-light-secondary text-sm mb-2 px-2">{department}</p>
                <ul className="space-y-2 text-xs">
                  {courses.map((course) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DegreeProgressTracker;