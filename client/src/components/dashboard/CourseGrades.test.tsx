// /client/src/components/dashboard/CourseGrades.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CourseGrades from './CourseGrades';

const mockSemesters = [
  {
    semester: 'Spring 2025',
    gpa: '3.70',
    courses: [
      { code: 'CSE225', title: 'Data Structures', credits: 3, grade: 'A-' },
      { code: 'CSE215', title: 'Programming Language II', credits: 3, grade: 'A' },
    ],
  },
  {
    semester: 'Fall 2024',
    gpa: '4.00',
    courses: [
      { code: 'CSE115', title: 'Programming Language I', credits: 3, grade: 'A' },
    ],
  },
];

describe('CourseGrades', () => {
  it('should render the title and the overall CGPA', () => {
    render(<CourseGrades semesters={mockSemesters} cgpa="3.85" />);
    expect(screen.getByText(/Course Grades & GPA/i)).toBeInTheDocument();
    expect(screen.getByText('3.85')).toBeInTheDocument();
  });

  it('should display the most recent semester by default', () => {
    render(<CourseGrades semesters={mockSemesters} cgpa="3.85" />);
    expect(screen.getByText('3.70')).toBeInTheDocument();
    expect(screen.getByText('Data Structures')).toBeInTheDocument();
    expect(screen.queryByText('Programming Language I')).not.toBeInTheDocument();
  });

  it('should update the view when a different semester is selected', () => {
    render(<CourseGrades semesters={mockSemesters} cgpa="3.85" />);
    const dropdown = screen.getByRole('combobox');
    fireEvent.change(dropdown, { target: { value: 'Fall 2024' } });
    expect(screen.getByText('4.00')).toBeInTheDocument();
    expect(screen.getByText('Programming Language I')).toBeInTheDocument();
    expect(screen.queryByText('Data Structures')).not.toBeInTheDocument();
  });
});