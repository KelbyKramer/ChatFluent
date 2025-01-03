import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, useLocation } from 'react-router-dom';
import LoginButton from '../components/LoginButton';
import InteractiveSession from './InteractiveSession';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const { 
    isAuthenticated, 
    isLoading, 
    error, 
    user, 
    getAccessTokenSilently,
    loginWithRedirect 
  } = useAuth0();

  useEffect(() => {
    const handleAuthenticationCode = async () => {
      if (location.search.includes('code=') && !isAuthenticated && !isProcessing) {
        setIsProcessing(true);
        console.log("Processing authentication code...");
        try {
          await getAccessTokenSilently();
          console.log("Token obtained successfully");
        } catch (e) {
          console.error("Error processing authentication:", e);
        } finally {
          setIsProcessing(false);
        }
      }
    };

    handleAuthenticationCode();
  }, [location, isAuthenticated, getAccessTokenSilently, isProcessing]);

  // Show loading state during initial load or code processing
  if (isLoading || isProcessing) {
    return <div>Processing authentication...</div>;
  }

  console.log("Dashboard state:", {
    isAuthenticated,
    user,
    error,
    hasCode: location.search.includes('code='),
    hasState: location.search.includes('state='),
    pathname: location.pathname,
    search: location.search
  });

  if (error) {
    return <div>Authentication Error: {error.message}</div>;
  }

  // If not authenticated and not processing a code, redirect to login
  if (!isAuthenticated && !location.search.includes('code=')) {
    return <Navigate to="/login" replace />;
  }

  // If not authenticated but we have a code, show loading
  if (!isAuthenticated && location.search.includes('code=')) {
    return <div>Finalizing authentication...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {user?.email}</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <InteractiveSession />
      <LoginButton />
    </div>
  );
};

export default Dashboard;