// /client/src/components/dashboard/AttendanceSummary.tsx

import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface AttendanceRecord {
  courseId: string;
  courseTitle: string;
  summary: {
    present: number;
    absent: number;
    total: number;
  };
}

interface SemesterAttendance {
  semester: string;
  records: AttendanceRecord[];
}

interface AttendanceSummaryProps {
  semesters: SemesterAttendance[];
}

const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({ semesters }) => {
  const [selectedSemester, setSelectedSemester] = useState<SemesterAttendance>(semesters[0]);

  const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const semesterData = semesters.find(s => s.semester === event.target.value);
    if (semesterData) {
      setSelectedSemester(semesterData);
    }
  };
  
  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-brand-lime';
    if (percentage >= 80) return 'text-brand-cyan';
    if (percentage >= 70) return 'text-brand-yellow';
    return 'text-brand-pink';
  }

  return (
    <div className="bg-dark-secondary shadow-xl rounded-lg p-6 border border-dark-tertiary">
      <h3 className="text-lg font-semibold text-light-primary mb-4">Attendance Summary</h3>

      <div className="flex justify-between items-center mb-6 p-4 bg-dark-primary/30 rounded-md">
        <div className="relative">
          <label htmlFor="semester-select" className="block text-sm font-medium text-light-tertiary mb-1">Select Semester</label>
          <select
            id="semester-select"
            value={selectedSemester.semester}
            onChange={handleSemesterChange}
            className="appearance-none w-full md:w-64 bg-dark-tertiary border border-dark-tertiary/50 text-light-primary rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-1 focus:ring-brand-blue"
          >
            {semesters.map(s => (
              <option key={s.semester} value={s.semester}>
                {s.semester}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="h-5 w-5 text-light-tertiary absolute top-9 right-3 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b-2 border-dark-tertiary">
            <tr>
              <th className="px-4 py-3 font-medium text-light-tertiary uppercase">Course Code</th>
              <th className="px-4 py-3 font-medium text-light-tertiary uppercase">Course Title</th>
              <th className="px-4 py-3 font-medium text-light-tertiary uppercase text-center">Classes Attended</th>
              <th className="px-4 py-3 font-medium text-light-tertiary uppercase text-center">Percentage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-tertiary">
            {selectedSemester.records.map(record => {
               const percentage = record.summary.total > 0
                ? (record.summary.present / record.summary.total) * 100
                : 0;

              return (
              <tr key={record.courseId} className="hover:bg-dark-tertiary/30 transition-colors">
                <td className="px-4 py-3 font-semibold text-light-primary">{record.courseId}</td>
                <td className="px-4 py-3 text-light-secondary">{record.courseTitle}</td>
                <td className="px-4 py-3 text-light-secondary text-center">
                  {record.summary.present} / {record.summary.total}
                </td>
                <td className={`px-4 py-3 font-bold text-lg text-center ${getPercentageColor(percentage)}`}>
                  {percentage.toFixed(1)}%
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceSummary;