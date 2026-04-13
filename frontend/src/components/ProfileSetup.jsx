import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";
import { apiRequest } from "@/api";
import { toast } from "sonner";
import useAppStore from "@/store";
import { useNavigate } from 'react-router-dom';

const avatarOptions = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=6",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=7",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=8",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=9",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=10",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=11",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=12"
];

const ProfileSetup = ({ onComplete }) => {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const navigate = useNavigate();

  const validateUsername = (value) => {
    if (value.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      setUsernameError('Username can only contain letters, numbers, underscores, and hyphens');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    validateUsername(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateUsername(username)) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest('POST', 'profile/setup', {
        username,
        avatar: selectedAvatar
      });

      if (response.data.success) {
        toast.success('Profile setup completed!');
        setUser(response.data.user);
        if (response.data?.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }   
        if (onComplete) onComplete();
        navigate('/feed');
      }
    } catch (error) {
      console.error('Profile setup error:', error);
      if (error.response?.data?.message?.includes('taken')) {
        setUsernameError('Username already taken');
      } else {
        toast.error(error.response?.data?.message || 'Failed to setup profile');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: '#fafaf9', fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
      `}</style>
      <Card 
        className="w-full max-w-md"
        style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: '16px' }}
      >
        <CardHeader>
          <CardTitle 
            className="syne"
            style={{ color: '#1c1917', fontFamily: "'Syne', sans-serif" }}
          >
            Complete Your Profile
          </CardTitle>
          <CardDescription style={{ color: '#57534e' }}>
            Choose a username and avatar to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <Label htmlFor="username" style={{ color: '#1c1917' }}>Username</Label>
              <Input
                id="username"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Enter username"
                maxLength={20}
                className={usernameError ? "border-red-500" : ""}
                style={{ borderColor: usernameError ? undefined : '#e7e5e4', borderRadius: '12px' }}
              />
              {usernameError && (
                <p className="text-sm text-red-500">{usernameError}</p>
              )}
            </div>

            {/* Avatar Selection */}
            <div className="space-y-2">
              <Label style={{ color: '#1c1917' }}>Choose Avatar</Label>
              <div className="grid grid-cols-4 gap-3">
                {avatarOptions.map((avatar, index) => (
                  <div
                    key={index}
                    className="relative cursor-pointer rounded-lg border-2 transition-all"
                    style={{
                      borderColor: selectedAvatar === avatar ? '#f59e0b' : '#e7e5e4',
                      boxShadow: selectedAvatar === avatar ? '0 0 0 2px #f59e0b' : 'none'
                    }}
                    onClick={() => setSelectedAvatar(avatar)}
                  >
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={avatar} alt={`Avatar ${index + 1}`} />
                      <AvatarFallback style={{ background: '#f5f4f2' }}>{index + 1}</AvatarFallback>
                    </Avatar>
                    {selectedAvatar === avatar && (
                      <div className="absolute -top-1 -right-1 rounded-full p-0.5" style={{ background: '#f59e0b' }}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full syne font-semibold text-white hover:opacity-90"
              disabled={loading || !username || usernameError}
              style={{ background: '#1c1917', borderRadius: '12px', fontFamily: "'Syne', sans-serif" }}
            >
              {loading ? 'Setting up...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
