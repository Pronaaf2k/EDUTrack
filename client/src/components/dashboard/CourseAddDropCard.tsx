// /client/src/components/dashboard/CourseAddDropCard.tsx

import React from 'react';
import { PlusCircleIcon, MinusCircleIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface Course {
  code: string;
  title: string;
  credits: number;
  schedule: {
    day: string;
    time: string;
    room: string;
  };
}

interface CourseAddDropCardProps {
  availableCourses: Course[];
  registeredCourses: Course[];
  onAdd: (courseCode: string) => void;
  onDrop: (courseCode: string) => void;
}

const CourseAddDropCard: React.FC<CourseAddDropCardProps> = ({
  availableCourses,
  registeredCourses,
  onAdd,
  onDrop,
}) => {
  return (
    <div className="bg-dark-secondary shadow-xl rounded-lg p-6 border border-dark-tertiary">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Courses Section */}
        <div>
          <h3 className="text-lg font-semibold text-light-primary mb-4 border-b border-dark-tertiary pb-2">
            Available Courses for Registration
          </h3>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {availableCourses.map((course) => (
              <div key={course.code} className="bg-dark-primary/50 p-4 rounded-lg flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-light-primary">{course.code} - {course.title}</h4>
                  <p className="text-sm text-light-tertiary">{course.credits} Credits</p>
                  <div className="mt-2 flex items-center text-xs text-light-secondary">
                    <ClockIcon className="h-4 w-4 mr-1.5" />
                    <span>{course.schedule.day}, {course.schedule.time}</span>
                    <MapPinIcon className="h-4 w-4 mr-1.5 ml-4" />
                    <span>{course.schedule.room}</span>
                  </div>
                </div>
                <button
                  onClick={() => onAdd(course.code)}
                  className="ml-4 flex-shrink-0 bg-brand-lime/20 text-brand-lime hover:bg-brand-lime/40 transition-colors p-2 rounded-full"
                  aria-label={`Add ${course.title}`}
                >
                  <PlusCircleIcon className="h-6 w-6" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Registered Courses Section */}
        <div>
          <h3 className="text-lg font-semibold text-light-primary mb-4 border-b border-dark-tertiary pb-2">
            Currently Registered Courses
          </h3>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {registeredCourses.length > 0 ? registeredCourses.map((course) => (
              <div key={course.code} className="bg-dark-primary/50 p-4 rounded-lg flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-light-primary">{course.code} - {course.title}</h4>
                  <p className="text-sm text-light-tertiary">{course.credits} Credits</p>
                  <div className="mt-2 flex items-center text-xs text-light-secondary">
                    <ClockIcon className="h-4 w-4 mr-1.5" />
                    <span>{course.schedule.day}, {course.schedule.time}</span>
                    <MapPinIcon className="h-4 w-4 mr-1.5 ml-4" />
                    <span>{course.schedule.room}</span>
                  </div>
                </div>
                <button
                  onClick={() => onDrop(course.code)}
                  className="ml-4 flex-shrink-0 bg-brand-pink/20 text-brand-pink hover:bg-brand-pink/40 transition-colors p-2 rounded-full"
                  aria-label={`Drop ${course.title}`}
                >
                  <MinusCircleIcon className="h-6 w-6" />
                </button>
              </div>
            )) : (
              <div className="text-center py-10 text-light-tertiary">
                <p>You have not registered for any courses this semester.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAddDropCard;