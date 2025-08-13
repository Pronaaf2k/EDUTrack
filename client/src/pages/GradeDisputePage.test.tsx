// client/src/pages/GradeDisputePage.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GradeDisputePage from './GradeDisputePage';

// Mock child components and context
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: {
      uid: 'test-user-uid',
      customId: '2212779042',
      displayName: 'Test User',
      profile: { advisorId: 'TNS1' },
    },
    loading: false,
  }),
}));

// Mock Firebase Firestore functions
const mockAddDoc = vi.fn();
const mockGetDocs = vi.fn();
vi.mock('firebase/firestore', async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        collection: vi.fn(),
        query: vi.fn(),
        where: vi.fn(),
        addDoc: (collectionRef, data) => mockAddDoc(data),
        serverTimestamp: vi.fn(() => new Date()),
        getDocs: () => mockGetDocs(),
    };
});

// Mock Header, Navbar, Footer to isolate the page component
vi.mock('../components/dashboard/DashboardHeader', () => ({ default: () => <div>DashboardHeader</div> }));
vi.mock('../components/dashboard/Navbar', () => ({ default: () => <div>Navbar</div> }));
vi.mock('../components/common/DashboardFooter', () => ({ default: () => <div>DashboardFooter</div> }));


describe('GradeDisputePage', () => {
  it('should allow a user to submit a new grade dispute', async () => {
    // Arrange: Mock Firestore to return graded courses but no existing disputes
    mockGetDocs.mockResolvedValue({
      docs: [
        // Mocking enrollments to populate the dropdown
        { data: () => ({ courseId: 'CSE173', courseDetails: { title: 'Discrete Mathematics' }, semester: 'Spring 2025', grade: 'A-' }) },
      ],
    });
    
    render(<GradeDisputePage />);

    // Act: Simulate user filling out the form
    const courseSelect = screen.getByLabelText(/Select Course/i);
    const expectedGradeInput = screen.getByLabelText(/Expected Grade/i);
    const reasonTextarea = screen.getByLabelText(/Reason for Dispute/i);
    const submitButton = screen.getByRole('button', { name: /Submit Dispute/i });

    await fireEvent.change(courseSelect, { target: { value: 'CSE173-Spring 2025' } });
    fireEvent.change(expectedGradeInput, { target: { value: 'A' } });
    fireEvent.change(reasonTextarea, { target: { value: 'I believe my final exam was graded incorrectly.' } });
    fireEvent.click(submitButton);

    // Assert: Check if the addDoc function was called with the correct payload
    await waitFor(() => {
      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.objectContaining({
          studentUid: 'test-user-uid',
          studentId: '2212779042',
          courseId: 'CSE173',
          semester: 'Spring 2025',
          currentGrade: 'A-',
          expectedGrade: 'A',
          reason: 'I believe my final exam was graded incorrectly.',
          status: 'Submitted',
        })
      );
    });
    
    // Check for success message
    expect(await screen.findByText(/Your grade dispute has been submitted successfully!/i)).toBeInTheDocument();
  });
});