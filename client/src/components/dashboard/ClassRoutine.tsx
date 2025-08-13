// /client/src/components/dashboard/ClassRoutine.tsx

import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

interface Schedule {
  day: string;
  time: string;
  room: string;
}

interface RoutineCourse {
  code: string;
  title: string;
  schedule: Schedule[];
}

interface ClassRoutineProps {
  courses: RoutineCourse[];
}

const ClassRoutine: React.FC<ClassRoutineProps> = ({ courses }) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const timeSlots = [
    '08:00 AM - 09:30 AM',
    '09:40 AM - 11:10 AM',
    '11:20 AM - 12:50 PM',
    '01:00 PM - 02:30 PM', // Adjusted for consistency, can be changed
    '02:00 PM - 03:30 PM', // Example slot
    '03:40 PM - 05:10 PM'
  ];

  // A helper function to find a course for a specific time slot and day
  const getCourseForSlot = (day: string, time: string) => {
    return courses.find(course =>
      course.schedule.some(s => s.day === day && s.time === time)
    );
  };

  return (
    <div className="bg-dark-secondary shadow-xl rounded-lg p-6 border border-dark-tertiary">
      <h3 className="text-lg font-semibold text-light-primary mb-4">
        Current Semester Class Routine
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-dark-tertiary/50">
            <tr>
              <th className="border border-dark-tertiary px-4 py-3 text-sm font-medium text-light-tertiary">
                <ClockIcon className="h-5 w-5 inline-block mr-2" />
                Time
              </th>
              {daysOfWeek.map(day => (
                <th key={day} className="border border-dark-tertiary px-4 py-3 text-sm font-medium text-light-tertiary">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(time => (
              <tr key={time}>
                <td className="border border-dark-tertiary px-4 py-3 text-xs font-mono text-light-tertiary text-center">{time}</td>
                {daysOfWeek.map(day => {
                  const course = getCourseForSlot(day, time);
                  return (
                    <td key={day} className="border border-dark-tertiary p-2 align-top h-24">
                      {course ? (
                        <div className="bg-gradient-to-br from-brand-purple to-brand-indigo/80 text-white rounded-md p-2 h-full flex flex-col justify-between text-xs">
                          <div>
                            <p className="font-bold text-sm">{course.code}</p>
                            <p className="text-light-secondary">{course.title}</p>
                          </div>
                          <p className="font-semibold text-right">Room: {course.schedule.find(s => s.day === day && s.time === time)?.room}</p>
                        </div>
                      ) : (
                        <div className="bg-dark-primary/20 h-full rounded-md"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassRoutine;