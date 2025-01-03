import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  if (isAuthenticated) {
    return (
      <button 
        onClick={() => logout({ 
          logoutParams: { 
            returnTo: window.location.origin 
          }
        })}
      >
        Log Out
      </button>
    );
  }

  return (
    <button 
      onClick={() => loginWithRedirect()}
    >
      Log In
    </button>
  );
};

export default LoginButton;