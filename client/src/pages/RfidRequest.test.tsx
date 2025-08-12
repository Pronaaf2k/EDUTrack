import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RfidRequest from './RfidRequest';
import { AuthContext } from '../context/AuthContext';

// Mock user context provider
const mockUser = {
  name: 'Suimee',
  idNumber: '123456',
};

describe('RfidRequest Component', () => {
  test('renders form with initial user data and submits', () => {
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <RfidRequest />
      </AuthContext.Provider>
    );

    // Check initial values
    expect(screen.getByLabelText(/name/i)).toHaveValue('Test User');
    expect(screen.getByLabelText(/id/i)).toHaveValue('123456');

    // Change input values
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'New Name' },
    });
    fireEvent.change(screen.getByLabelText(/id/i), {
      target: { value: '654321' },
    });

    expect(screen.getByLabelText(/name/i)).toHaveValue('New Name');
    expect(screen.getByLabelText(/id/i)).toHaveValue('654321');

    // Mock window alert
    window.alert = jest.fn();

    // Click apply button
    fireEvent.click(screen.getByRole('button', { name: /apply/i }));

    // Expect alert to be called with submitted values
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('New Name')
    );
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('654321')
    );
  });
});
