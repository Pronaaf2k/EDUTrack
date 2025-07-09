import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import PageFooter from '../components/common/PageFooter';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    console.log("Login successful, navigating to dashboard...");
    // This will be replaced with real auth logic from Firestore later
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-primary">
      <PageHeader />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </main>
      <PageFooter />
    </div>
  );
};

export default LoginPage;
