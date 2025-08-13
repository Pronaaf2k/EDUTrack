import React, { useState } from 'react';
import { AcademicCapIcon, ChevronDownIcon } from '@heroicons/react/24/outline';


interface GradeRecord {
  code: string;
  title: string;
  credits: number;
  grade: string;
}

interface SemesterData {
  semester: string;
  gpa: string;
  courses: GradeRecord[];
}

interface CourseGradesProps {
  semesters: SemesterData[];
  cgpa: string;
}

const getGradeColor = (grade: string): string => {
  const gradeValue = parseFloat(grade);
  if (grade.startsWith('A') || gradeValue === 4.0) return 'text-brand-lime';
  if (grade.startsWith('B') || gradeValue >= 3.0) return 'text-brand-cyan';
  if (grade.startsWith('C') || gradeValue >= 2.0) return 'text-brand-yellow';
  if (grade.startsWith('D') || gradeValue >= 1.0) return 'text-brand-orange';
  return 'text-brand-pink'; 
};

const CourseGrades: React.FC<CourseGradesProps> = ({ semesters, cgpa }) => {
  const [selectedSemester, setSelectedSemester] = useState<SemesterData>(semesters[0]);

  const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const semesterData = semesters.find(s => s.semester === event.target.value);
    if (semesterData) {
      setSelectedSemester(semesterData);
    }
  };

  return (
    <div className="bg-dark-secondary shadow-xl rounded-lg p-6 border border-dark-tertiary">
      <h3 className="text-lg font-semibold text-light-primary mb-4">
        Course Grades & GPA
      </h3>

      {/* Semester Selector and CGPA display */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 p-4 bg-dark-primary/30 rounded-md">
        <div className="relative w-full md:w-auto mb-4 md:mb-0">
          <select
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
          <ChevronDownIcon className="h-5 w-5 text-light-tertiary absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex space-x-6 text-center">
          <div>
            <p className="text-sm text-light-tertiary">Semester GPA</p>
            <p className="text-2xl font-bold text-brand-cyan">{selectedSemester.gpa}</p>
          </div>
          <div>
            <p className="text-sm text-light-tertiary">Cumulative GPA (CGPA)</p>
            <p className="text-2xl font-bold text-brand-lime">{cgpa}</p>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b-2 border-dark-tertiary">
            <tr>
              <th className="px-4 py-3 font-medium text-light-tertiary uppercase">Course Code</th>
              <th className="px-4 py-3 font-medium text-light-tertiary uppercase">Course Title</th>
              <th className="px-4 py-3 font-medium text-light-tertiary uppercase text-center">Credits</th>
              <th className="px-4 py-3 font-medium text-light-tertiary uppercase text-center">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-tertiary">
            {selectedSemester.courses.map(course => (
              <tr key={course.code} className="hover:bg-dark-tertiary/30 transition-colors">
                <td className="px-4 py-3 font-semibold text-light-primary">{course.code}</td>
                <td className="px-4 py-3 text-light-secondary">{course.title}</td>
                <td className="px-4 py-3 text-light-secondary text-center">{course.credits.toFixed(2)}</td>
                <td className={`px-4 py-3 font-bold text-lg text-center ${getGradeColor(course.grade)}`}>
                  {course.grade}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseGrades;