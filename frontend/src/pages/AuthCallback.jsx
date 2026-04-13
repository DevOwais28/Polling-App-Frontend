import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import  useAppStore  from '../store';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAppStore();

  useEffect(() => {
    const handleAuthCallback = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const authData = params.get('auth');
        const error = params.get('error');

        if (error) {
          toast.error('Authentication failed. Please try again.');
          navigate('/login');
          return;
        }

        if (authData) {
          const parsed = JSON.parse(decodeURIComponent(authData));
          if (parsed.login && parsed.token && parsed.user) {
            // Set auth state
            setToken(parsed.token);
            setUser(parsed.user);
            
            // Store in localStorage
            localStorage.setItem('token', parsed.token);
            localStorage.setItem('user', JSON.stringify(parsed.user));
            
            // Show welcome message for new users
            if (parsed.user.isNewUser) {
              toast.success('Welcome to WePollin! Your account has been created successfully.');
            } else {
              toast.success('Successfully logged in with Google');
            }
            
            // Clean up URL and redirect to feed
            window.history.replaceState({}, '', '/');
            navigate('/feed');
          }
        } else {
          // No auth data found, redirect to home
          navigate('/');
        }
      } catch (error) {
        console.error('Error processing auth callback:', error);
        toast.error('Failed to process authentication. Please try again.');
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, setToken, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#fafaf9', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Google Font Loader */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
      `}</style>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4" style={{ borderColor: '#f59e0b' }}></div>
        <p style={{ color: '#57534e' }}>Completing sign in...</p>
      </div>
    </div>
  );
}
