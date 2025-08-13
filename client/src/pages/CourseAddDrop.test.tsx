import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CourseAddDrop from './CourseAddDrop';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';


jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));


jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn((val) => val),
  arrayRemove: jest.fn((val) => val),
}));

describe('CourseAddDrop Component', () => {
  const mockUser = {
    uid: 'user123',
    name: 'Suimee',
    idNumber: '123456',
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    // Mock Firestore data
    (getDocs as jest.Mock).mockResolvedValue({
      forEach: (cb: any) => {
        cb({ id: 'CSE115', data: () => ({ title: 'Intro to C Programming', credits: 3 }) });
        cb({ id: 'MATH120', data: () => ({ title: 'Calculus I', credits: 3 }) });
      },
    });

    jest.clearAllMocks();
  });

  test('renders with user data and course list', async () => {
    render(<CourseAddDrop />);

    expect(screen.getByDisplayValue('Suimee')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123456')).toBeInTheDocument();

    // Wait for courses to load
    await waitFor(() => {
      expect(screen.getByText(/Intro to C Programming/)).toBeInTheDocument();
      expect(screen.getByText(/Calculus I/)).toBeInTheDocument();
    });
  });

  test('adds a course when Add button is clicked', async () => {
    render(<CourseAddDrop />);

    await waitFor(() => screen.getByText(/Intro to CS/));

    fireEvent.change(screen.getByLabelText(/Select Course/i), {
      target: { value: 'CSE115' },
    });

    // Mock alert
    window.alert = jest.fn();

    fireEvent.click(screen.getByRole('button', { name: /Add/i }));

    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
        enrolledCourses: expect.any(Function),
      });
      expect(window.alert).toHaveBeenCalledWith('Course added successfully!');
    });
  });

  test('drops a course when Drop button is clicked', async () => {
    render(<CourseAddDrop />);

    await waitFor(() => screen.getByText(/Intro to CS/));

    fireEvent.change(screen.getByLabelText(/Select Course/i), {
      target: { value: 'CSE115' },
    });

    // Mock alert
    window.alert = jest.fn();

    fireEvent.click(screen.getByRole('button', { name: /Drop/i }));

    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
        enrolledCourses: expect.any(Function),
      });
      expect(window.alert).toHaveBeenCalledWith('Course dropped successfully!');
    });
  });
});
