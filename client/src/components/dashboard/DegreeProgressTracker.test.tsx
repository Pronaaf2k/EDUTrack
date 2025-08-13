// /client/src/components/dashboard/DegreeProgressTracker.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DegreeProgressTracker from './DegreeProgressTracker';

const mockProgressData = {
  completedCourses: [
    { code: 'CSE115', title: 'Programming Language I', credits: 3 },
    { code: 'MAT120', title: 'Calculus I', credits: 3 },
  ],
  remainingCoursesByDept: {
    CSE: [
      { code: 'CSE225', title: 'Data Structures', credits: 3 },
      { code: 'CSE215', title: 'Programming Language II', credits: 3 },
    ],
    ENG: [{ code: 'ENG102', title: 'Composition', credits: 3 }],
  },
  totalCredits: 130,
  completedCredits: 6,
};

describe('DegreeProgressTracker', () => {
  it('should display the correct credit completion summary', () => {
    render(<DegreeProgressTracker {...mockProgressData} />);
    expect(screen.getByText('6 / 130 Credits')).toBeInTheDocument();
  });

  it('should display the correct count of completed and remaining courses', () => {
    render(<DegreeProgressTracker {...mockProgressData} />);
    expect(screen.getByText('Completed Courses (2)')).toBeInTheDocument();
    expect(screen.getByText('Remaining Courses (3)')).toBeInTheDocument();
  });

  it('should render remaining courses grouped by department', () => {
    render(<DegreeProgressTracker {...mockProgressData} />);
    expect(screen.getByText('CSE')).toBeInTheDocument();
    expect(screen.getByText('ENG')).toBeInTheDocument();
    expect(screen.getByText(/Data Structures/i)).toBeInTheDocument();
  });
});