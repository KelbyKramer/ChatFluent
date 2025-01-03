import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import InteractiveSession from './pages/InteractiveSession';

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/practice" element={<InteractiveSession />} />
      </Routes>
    </Router>
  );
}

export default App;
