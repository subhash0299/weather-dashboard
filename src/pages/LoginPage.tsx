import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <LoginForm />
    </div>
  );
};

export default LoginPage;