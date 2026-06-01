import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Plants from './pages/Plants';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import TargetCursor from './components/TargetCursor';

function App() {
  return (
    <BrowserRouter>
      {/* TargetCursor will be globally available across all pages */}
      <TargetCursor 
        spinDuration={2} 
        parallaxOn={true} 
        targetSelector=".cursor-target, button, a, input, [role='button'], h1, h2, h3, p, label, .text-target" 
      />
      <Routes>
        <Route
          path="/login"
          element={(
            <PublicRoute>
              <Login />
            </PublicRoute>
          )}
        />
        
        <Route
          path="/"
          element={(
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={<Dashboard />} />
          <Route path="plants" element={<Plants />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;