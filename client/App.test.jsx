import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page', () => {
  render(<App />);
  const loginHeading = screen.getByText(/login page/i);
  expect(loginHeading).toBeInTheDocument();
});