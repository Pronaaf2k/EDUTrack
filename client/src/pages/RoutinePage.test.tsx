// client/src/pages/RoutinePage.test.tsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RoutinePage from './RoutinePage';

// Mock dependencies
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { uid: 'test-user-uid', customId: '12345', displayName: 'Test User' },
    loading: false,
  }),
}));

const mockGetDocs = vi.fn();
vi.mock('firebase/firestore', async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        collection: vi.fn(),
        query: vi.fn(),
        orderBy: vi.fn(),
        getDocs: () => mockGetDocs(),
    };
});

vi.mock('../components/dashboard/DashboardHeader', () => ({ default: () => <div>DashboardHeader</div> }));
vi.mock('../components/dashboard/Navbar', () => ({ default: () => <div>Navbar</div> }));
vi.mock('../components/common/DashboardFooter', () => ({ default: () => <div>DashboardFooter</div> }));

describe('RoutinePage', () => {
  it('should display the routine for the latest semester only', async () => {
    // Arrange: Mock Firestore to return enrollments from two different semesters
    mockGetDocs.mockResolvedValue({
      docs: [
        // Firestore is mocked to return Fall 2025 first because of orderBy("semester", "desc")
        { data: () => ({ courseId: 'CSE373', semester: 'Fall 2025', courseDetails: { title: 'Algorithms', schedule: [{ day: 'Monday', time: '08:00 AM - 09:30 AM', room: 'NAC101' }] } }) },
        { data: () => ({ courseId: 'CSE225', semester: 'Summer 2025', courseDetails: { title: 'Data Structures', schedule: [{ day: 'Tuesday', time: '09:40 AM - 11:10 AM', room: 'SAC202' }] } }) },
      ],
    });

    render(<RoutinePage />);

    // Assert: Check that the latest semester's title and course are displayed
    await waitFor(() => {
        expect(screen.getByText(/Class Routine - Fall 2025/i)).toBeInTheDocument();
        expect(screen.getByText('Algorithms')).toBeInTheDocument();
    });
    
    // Assert that the older course is NOT displayed
    expect(screen.queryByText('Data Structures')).not.toBeInTheDocument();
  });

  it('should display a "No Routine Found" message if there are no enrollments', async () => {
    // Arrange: Mock Firestore to return no enrollments
    mockGetDocs.mockResolvedValue({
      docs: [],
    });

    render(<RoutinePage />);

    // Assert
    await waitFor(() => {
        expect(screen.getByText(/No Routine Found/i)).toBeInTheDocument();
    });
  });
});
