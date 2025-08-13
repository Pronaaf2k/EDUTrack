// client/src/pages/RoutinePage.test.tsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RoutinePage from './RoutinePage';
import { BrowserRouter } from 'react-router-dom';
import { getDocs } from 'firebase/firestore';

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
    return { ...actual, getDocs: vi.fn() };
});

vi.mock('../components/dashboard/DashboardHeader', () => ({ default: () => <div>DashboardHeader</div> }));
vi.mock('../components/dashboard/Navbar', () => ({ default: () => <div>Navbar</div> }));
vi.mock('../components/common/DashboardFooter', () => ({ default: () => <div>DashboardFooter</div> }));

describe('RoutinePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display the routine for the latest semester only', async () => {
    (getDocs as vi.Mock).mockResolvedValue({
      empty: false,
      docs: [
        { data: () => ({ courseId: 'CSE373', semester: 'Fall 2025', courseDetails: { title: 'Algorithms', schedule: [{ day: 'Monday', time: '08:00 AM - 09:30 AM', room: 'NAC101' }] } }) },
        { data: () => ({ courseId: 'CSE225', semester: 'Summer 2025', courseDetails: { title: 'Data Structures', schedule: [{ day: 'Tuesday', time: '09:40 AM - 11:10 AM', room: 'SAC202' }] } }) },
      ],
    });

    render(<BrowserRouter><RoutinePage /></BrowserRouter>);

    // Assert: Use a function to match text content across multiple child elements
    await waitFor(() => {
      expect(screen.getByText((content, element) => element?.textContent === 'Class Routine - Fall 2025')).toBeInTheDocument();
    });

    expect(screen.getByText('Algorithms')).toBeInTheDocument();
    expect(screen.queryByText('Data Structures')).not.toBeInTheDocument();
  });

  it('should display a "No Routine Found" message if there are no enrollments', async () => {
    (getDocs as vi.Mock).mockResolvedValue({ empty: true, docs: [] });
    render(<BrowserRouter><RoutinePage /></BrowserRouter>);
    expect(await screen.findByText(/No Routine Found/i)).toBeInTheDocument();
  });
});