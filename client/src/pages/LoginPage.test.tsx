// /client/src/pages/LoginPage.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from './LoginPage';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { signInUser } from '../firebase/auth';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const original = await importOriginal<typeof import('react-router-dom')>();
    return { ...original, useNavigate: () => mockNavigate };
});

// Mock the Firebase auth module
vi.mock('../firebase/auth', async (importActual) => {
    const actual = await importActual<typeof import('../firebase/auth')>();
    return { ...actual, signInUser: vi.fn() };
});

// Mock child components
vi.mock('../components/common/PageHeader', () => ({ default: () => <div>PageHeader Mock</div> }));
vi.mock('../components/common/PageFooter', () => ({ default: () => <div>PageFooter Mock</div> }));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle the full login flow and call signInUser on submit', async () => {
    (signInUser as vi.Mock).mockResolvedValue({ uid: 'test-uid' });
    render(<BrowserRouter><AuthProvider><LoginPage /></AuthProvider></BrowserRouter>);

    // Act 1: Wait for the username input to appear, then fill it
    const usernameInput = await screen.findByPlaceholderText('Enter your ID');
    fireEvent.change(usernameInput, { target: { value: '2212779042' } });
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Act 2: Wait for the password input, then fill the form and submit
    const passwordInput = await screen.findByPlaceholderText('Enter your password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Enter the numbers shown'), { target: { value: '3446' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    // Assert
    await waitFor(() => {
      expect(signInUser).toHaveBeenCalledWith('2212779042', 'password123');
    });
  });

  it('should display an error message on failed login', async () => {
    (signInUser as vi.Mock).mockRejectedValue(new Error('Invalid username or password.'));
    render(<BrowserRouter><AuthProvider><LoginPage /></AuthProvider></BrowserRouter>);

    // Act
    const usernameInput = await screen.findByPlaceholderText('Enter your ID');
    fireEvent.change(usernameInput, { target: { value: '2212779042' } });
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    const passwordInput = await screen.findByPlaceholderText('Enter your password');
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.change(screen.getByPlaceholderText('Enter the numbers shown'), { target: { value: '3446' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    // Assert
    expect(await screen.findByText('Invalid username or password.')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});