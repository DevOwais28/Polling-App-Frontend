import { useState } from 'react';
import './App.css';
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter } from 'react-router-dom';
import Router from './Router.jsx';
import { useProfileCheck } from './hooks/useProfileCheck';
import ProfileSetup from './components/ProfileSetup';
import useAppStore from './store';

function App() {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const { needsSetup, loading } = useProfileCheck();

  const handleProfileComplete = () => {
    // ProfileSetup already updates the user in the store and localStorage
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster />
      {user && needsSetup ? (
        <ProfileSetup onComplete={handleProfileComplete} />
      ) : (
        <Router />
      )}
    </BrowserRouter>
  )
}

export default App
