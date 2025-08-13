// client/src/pages/AttendancePage.test.tsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AttendancePage from './AttendancePage';
import { BrowserRouter } from 'react-router-dom';
import { getDocs } from 'firebase/firestore'; // Import the function we are mocking

// Mock dependencies
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: {
      uid: 'test-user-uid', customId: '12345', displayName: 'Test User',
      email: 'test@edutrack.app', role: 'student',
      profile: {
          degree: 'BS in CSE', curriculum: 'BS in CSE - 130 Credit',
          avatarUrl: 'https://example.com/avatar.jpg', advisorId: 'TNS1'
      }
    },
    loading: false,
  }),
}));

vi.mock('firebase/firestore', async (importActual) => {
    const actual = await importActual<typeof import('firebase/firestore')>();
    return {
        ...actual,
        getDocs: vi.fn(), // Create the mock function inside the factory
    };
});

vi.mock('../components/dashboard/DashboardHeader', () => ({ default: () => <div>DashboardHeader</div> }));
vi.mock('../components/dashboard/Navbar', () => ({ default: () => <div>Navbar</div> }));
vi.mock('../components/common/DashboardFooter', () => ({ default: () => <div>DashboardFooter</div> }));

describe('AttendancePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display attendance data from Firestore when available', async () => {
    // Arrange: Cast the imported function as a mock and set its resolved value
    (getDocs as vi.Mock).mockResolvedValue({
      empty: false,
      docs: [
        { data: () => ({ courseId: 'CSE115', courseDetails: { title: 'Programming I' }, semester: 'Summer 2025', attendanceSummary: { present: 22, absent: 2, total: 24 } }) },
      ],
    });

    render(<BrowserRouter><AttendancePage /></BrowserRouter>);

    // Assert: Check that real data is displayed
    await waitFor(() => {
        expect(screen.getByText('CSE115')).toBeInTheDocument();
        expect(screen.getByText('Programming I')).toBeInTheDocument();
        expect(screen.getByText('22 / 24')).toBeInTheDocument();
    });
  });

  it('should display synthetic attendance data when no Firestore data is found', async () => {
    // Arrange: Mock an empty response from Firestore
    (getDocs as vi.Mock).mockResolvedValue({
      empty: true,
      docs: [],
    });

    render(<BrowserRouter><AttendancePage /></BrowserRouter>);

    // Assert: Check for synthetic data
    await waitFor(() => {
        expect(screen.getByText(/Discrete Mathematics/i)).toBeInTheDocument();
        expect(screen.getByText(/Physics I/i)).toBeInTheDocument();
    });
  });
});