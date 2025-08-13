// client/src/pages/GradeDisputePage.test.tsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GradeDisputePage from './GradeDisputePage';
import { BrowserRouter } from 'react-router-dom';
import { getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

// ✅ FIX: Define a stable user object outside the mock implementation.
const mockUser = {
  uid: 'test-user-uid',
  customId: '2212779042',
  displayName: 'Test User',
  email: 'test@edutrack.app',
  role: 'student',
  profile: {
    advisorId: 'TNS1',
    degree: 'BS in CSE',
    curriculum: 'BS in CSE - 130 Credit',
    avatarUrl: 'https://example.com/avatar.jpg'
  },
};

// Mock dependencies
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    // ✅ FIX: Return the stable user object and loading state.
    currentUser: mockUser,
    loading: false,
  }),
}));

vi.mock('firebase/firestore');
vi.mock('../components/dashboard/DashboardHeader', () => ({ default: () => <div>DashboardHeader</div> }));
vi.mock('../components/dashboard/Navbar', () => ({ default: () => <div>Navbar</div> }));
vi.mock('../components/common/DashboardFooter', () => ({ default: () => <div>DashboardFooter</div> }));

describe('GradeDisputePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow a user to submit a new grade dispute', async () => {
    // Arrange
    const user = userEvent.setup();
    const getDocsMock = getDocs as vi.Mock;
    const addDocMock = addDoc as vi.Mock;
    (serverTimestamp as vi.Mock).mockReturnValue(new Date());

    // This mock setup is correct.
    let callCount = 0;
    getDocsMock.mockImplementation(() => {
      callCount++;
      if (callCount === 1) { // Initial enrollments
        return Promise.resolve({
          docs: [{ data: () => ({ courseId: 'CSE173', courseDetails: { title: 'Discrete Mathematics' }, semester: 'Spring 2025', grade: 'A-' }) }],
        });
      }
      if (callCount === 2) { // Initial disputes
        return Promise.resolve({ docs: [] });
      }
      if (callCount === 3 || callCount === 5) { // Refetch enrollments
        return Promise.resolve({
          docs: [{ data: () => ({ courseId: 'CSE173', courseDetails: { title: 'Discrete Mathematics' }, semester: 'Spring 2025', grade: 'A-' }) }],
        });
      }
      if (callCount === 4 || callCount === 6) { // Refetch disputes
        return Promise.resolve({
          docs: [{ id: 'new-id', data: () => ({ courseId: 'CSE173', semester: 'Spring 2025', currentGrade: 'A-', expectedGrade: 'A', status: 'Submitted', submittedAt: { seconds: Date.now() / 1000 } }) }],
        });
      }
      return Promise.resolve({ docs: [] });
    });

    addDocMock.mockResolvedValue({ id: 'new-dispute-id' });

    render(<BrowserRouter><GradeDisputePage /></BrowserRouter>);

    // ✅ This waitFor is crucial and correct. It waits for the async fetchData to complete.
    await waitFor(() => {
      expect(screen.queryByText(/Loading Grade Disputes.../i)).not.toBeInTheDocument();
    });

    // Act
    const courseSelect = screen.getByLabelText(/Select Course/i);
    await user.selectOptions(courseSelect, 'CSE173-Spring 2025');
    await user.type(screen.getByLabelText(/Expected Grade/i), 'A');
    await user.type(screen.getByLabelText(/Reason for Dispute/i), 'Reason for testing.');
    await user.click(screen.getByRole('button', { name: /Submit Dispute/i }));

    // Assert
    expect(await screen.findByText(/Your grade dispute has been submitted successfully!/i)).toBeInTheDocument();
    expect(await screen.findByText('Submitted')).toBeInTheDocument();
  });
});