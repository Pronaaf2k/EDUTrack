// client/src/pages/AttendancePage.test.tsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AttendancePage from './AttendancePage';

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

describe('AttendancePage', () => {
  it('should display attendance data from Firestore when available', async () => {
    // Arrange: Mock Firestore to return real enrollment data
    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [
        { data: () => ({ courseId: 'CSE115', courseDetails: { title: 'Programming I' }, semester: 'Summer 2025', attendanceSummary: { present: 22, absent: 2, total: 24 } }) },
      ],
    });

    render(<AttendancePage />);

    // Assert: Check that real data is displayed
    await waitFor(() => {
        expect(screen.getByText('CSE115')).toBeInTheDocument();
        expect(screen.getByText('Programming I')).toBeInTheDocument();
        expect(screen.getByText('22 / 24')).toBeInTheDocument();
    });
  });

  it('should display synthetic attendance data when no Firestore data is found', async () => {
    // Arrange: Mock Firestore to return an empty snapshot
    mockGetDocs.mockResolvedValue({
      empty: true,
      docs: [],
    });

    render(<AttendancePage />);

    // Assert: Check that one of the synthetic course titles is on the screen
    await waitFor(() => {
        expect(screen.getByText(/Discrete Mathematics/i)).toBeInTheDocument();
        expect(screen.getByText(/Physics I/i)).toBeInTheDocument();
    });
  });
});