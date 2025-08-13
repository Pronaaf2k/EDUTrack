// client/src/pages/GradeDisputePage.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GradeDisputePage from './GradeDisputePage';
import { BrowserRouter } from 'react-router-dom';
import { getDocs, addDoc } from 'firebase/firestore'; // Import mocked functions

// Mock dependencies
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: {
      uid: 'test-user-uid', customId: '2212779042', displayName: 'Test User',
      email: 'test@edutrack.app', role: 'student',
      profile: {
        advisorId: 'TNS1', degree: 'BS in CSE', curriculum: 'BS in CSE - 130 Credit',
        avatarUrl: 'https://example.com/avatar.jpg'
      },
    },
    loading: false,
  }),
}));

vi.mock('firebase/firestore', async (importActual) => {
    const actual = await importActual<typeof import('firebase/firestore')>();
    return {
        ...actual,
        getDocs: vi.fn(),
        addDoc: vi.fn(),
        serverTimestamp: vi.fn(() => new Date()),
    };
});

vi.mock('../components/dashboard/DashboardHeader', () => ({ default: () => <div>DashboardHeader</div> }));
vi.mock('../components/dashboard/Navbar', () => ({ default: () => <div>Navbar</div> }));
vi.mock('../components/common/DashboardFooter', () => ({ default: () => <div>DashboardFooter</div> }));

describe('GradeDisputePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow a user to submit a new grade dispute', async () => {
    // Arrange
    const getDocsMock = getDocs as vi.Mock;

    // --- FIX: Provide a mock for every call to getDocs ---
    // Mock for the INITIAL load (first 2 calls)
    getDocsMock
      .mockResolvedValueOnce({ // 1. Initial enrollments fetch
        docs: [{ data: () => ({ courseId: 'CSE173', courseDetails: { title: 'Discrete Mathematics' }, semester: 'Spring 2025', grade: 'A-' }) }],
      })
      .mockResolvedValueOnce({ docs: [] }); // 2. Initial disputes fetch (empty)

    // Mock for the REFETCH after submission (next 2 calls)
    getDocsMock
      .mockResolvedValueOnce({ // 3. Re-fetch enrollments
        docs: [{ data: () => ({ courseId: 'CSE173', courseDetails: { title: 'Discrete Mathematics' }, semester: 'Spring 2025', grade: 'A-' }) }],
      })
      .mockResolvedValueOnce({ // 4. Re-fetch disputes (now has one item)
        docs: [{ id: 'new-id', data: () => ({ courseId: 'CSE173', semester: 'Spring 2025', currentGrade: 'A-', expectedGrade: 'A', status: 'Submitted', submittedAt: { seconds: Date.now() / 1000 } }) }],
      });

    (addDoc as vi.Mock).mockResolvedValue({ id: 'new-dispute-id' });

    render(<BrowserRouter><GradeDisputePage /></BrowserRouter>);

    // Act & Assert: Wait for the form to appear after the initial loading is done
    const courseSelect = await screen.findByLabelText(/Select Course/i);
    const expectedGradeInput = screen.getByLabelText(/Expected Grade/i);
    const reasonTextarea = screen.getByLabelText(/Reason for Dispute/i);
    const submitButton = screen.getByRole('button', { name: /Submit Dispute/i });

    // Act: Fill and submit the form
    await fireEvent.change(courseSelect, { target: { value: 'CSE173-Spring 2025' } });
    fireEvent.change(expectedGradeInput, { target: { value: 'A' } });
    fireEvent.change(reasonTextarea, { target: { value: 'Reason for testing.' } });
    fireEvent.click(submitButton);

    // Assert: Check for the success message, which now should appear
    expect(await screen.findByText(/Your grade dispute has been submitted successfully!/i)).toBeInTheDocument();
    
    // Assert that the tracker component now shows the newly submitted dispute
    expect(await screen.findByText('Submitted')).toBeInTheDocument();
  });
});