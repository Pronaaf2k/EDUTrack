// client/src/components/dashboard/GradeDisputeForm.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GradeDisputeForm from './GradeDisputeForm';

describe('GradeDisputeForm', () => {
  const mockCourses = [
    { courseId: 'CSE173', courseTitle: 'Discrete Mathematics', semester: 'Spring 2025', grade: 'A-' },
    { courseId: 'CSE225', courseTitle: 'Data Structures', semester: 'Summer 2025', grade: 'B+' },
  ];
  const mockOnSubmit = vi.fn(() => Promise.resolve());

  it('should not submit if required fields are empty', () => {
    // Arrange
    render(<GradeDisputeForm gradedCourses={mockCourses} onSubmit={mockOnSubmit} />);

    // Act
    const submitButton = screen.getByRole('button', { name: /Submit Dispute/i });
    fireEvent.click(submitButton);
    
    // Assert
    expect(screen.getByText('All fields are required.')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call the onSubmit prop with correct data when form is valid', async () => {
    // Arrange
    render(<GradeDisputeForm gradedCourses={mockCourses} onSubmit={mockOnSubmit} />);

    // Act
    const courseSelect = screen.getByLabelText(/Select Course/i);
    const expectedGradeInput = screen.getByLabelText(/Expected Grade/i);
    const reasonTextarea = screen.getByLabelText(/Reason for Dispute/i);
    const submitButton = screen.getByRole('button', { name: /Submit Dispute/i });

    await fireEvent.change(courseSelect, { target: { value: 'CSE173-Spring 2025' } });
    fireEvent.change(expectedGradeInput, { target: { value: 'A' } });
    fireEvent.change(reasonTextarea, { target: { value: 'Calculation error on final.' } });
    fireEvent.click(submitButton);
    
    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith({
      courseId: 'CSE173',
      semester: 'Spring 2025',
      currentGrade: 'A-',
      expectedGrade: 'A',
      reason: 'Calculation error on final.',
    });
  });
});