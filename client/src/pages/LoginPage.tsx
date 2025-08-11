// /client/src/pages/LoginPage.tsx

import React, { useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import PageHeader from '../components/common/PageHeader';
import PageFooter from '../components/common/PageFooter';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth(); // Get the currentUser from our context

  // This effect will run whenever the currentUser state changes.
  useEffect(() => {
    // If the loading is done and we have a valid user, it means login was successful
    // and the context has been updated. NOW it's safe to navigate.
    if (!loading && currentUser) {
      console.log("AuthContext has user, navigating to dashboard...");
      navigate('/dashboard');
    }
  }, [currentUser, loading, navigate]); // Dependencies for the effect

  // This function is still needed to pass to the LoginForm.
  // The form itself doesn't need to know about navigation; it just reports success.
  const handleLoginSuccess = () => {
    console.log("Login form submitted successfully. Waiting for AuthContext to update.");
    // We no longer navigate here. The useEffect hook will handle it.
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