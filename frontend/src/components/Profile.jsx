import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Edit, Save, X, ArrowLeft, Lock, Eye } from "lucide-react";
import { apiRequest } from "@/api";
import { toast } from "sonner";
import useAppStore from "@/store";

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

const Profile = () => {
  const { userId } = useParams();
  console.log("userId of clicked account",userId);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [privatePollsLoading, setPrivatePollsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [profileUser, setProfileUser] = useState(undefined); // undefined = not fetched yet
  const [privatePolls, setPrivatePolls] = useState([]);

  const currentUser = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  const currentUserId = currentUser?._id || currentUser?.id || null;
  const isOwnProfile = !userId || (currentUserId && userId === currentUserId);
  const displayUser = isOwnProfile ? currentUser : profileUser;

  useEffect(() => {
    const initProfile = async () => {
      // Own profile
      if (isOwnProfile && currentUserId) {
        // If username is missing in store (e.g. older login), fetch full profile once
        if (!currentUser?.username) {
          try {
            const response = await apiRequest('GET', `/profile/${currentUserId}`);
            if (response.data?.success && response.data.user) {
              setUser(response.data.user);
            }
          } catch (err) {
            console.error('Failed to hydrate current user profile:', err);
          }
        }

        setUsername(currentUser?.username || '');
        setSelectedAvatar(currentUser?.avatar || avatarOptions[0]);
        await fetchPrivatePolls(currentUserId);
      }

      // Someone else's profile
      if (!isOwnProfile && userId) {
        await fetchUserProfile(userId);
      }
    };

    void initProfile();
  }, [isOwnProfile, currentUserId, currentUser?.username, currentUser?.avatar, userId]);

  const fetchUserProfile = async (userId) => {
    setProfileLoading(true);
    try {
      const response = await apiRequest('GET', `/profile/${userId}`);
      if (response.data.success) {
        setProfileUser(response.data.user);
        console.log("profileUser",profileUser);
      } else {
        setProfileUser(null); // User not found
        toast.error('User not found');
      }
    } catch (error) {
      setProfileUser(null);
      toast.error('Failed to load user profile');
      console.error(error);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchPrivatePolls = async (userId) => {
    if (!userId) {
      console.warn('fetchPrivatePolls called without userId, skipping');
      return;
    }

    setPrivatePollsLoading(true);
    try {
      const response = await apiRequest('GET', `/profile/${userId}/private-polls`);
      if (response.data.success) {
        setPrivatePolls(response.data.polls);
      }
    } catch (error) {
      console.error('Failed to load private polls:', error);
    } finally {
      setPrivatePollsLoading(false);
    }
  };

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

  const handleSave = async () => {
    if (!validateUsername(username)) return;

    setLoading(true);
    try {
      const response = await apiRequest('PUT', 'profile/update', {
        username,
        avatar: selectedAvatar
      });

      if (response.data.success) {
        toast.success('Profile updated successfully!');
        setUser(response.data.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.response?.data?.message?.includes('taken')) {
        setUsernameError('Username already taken');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUsername(currentUser.username || '');
    setSelectedAvatar(currentUser.avatar || avatarOptions[0]);
    setUsernameError('');
    setIsEditing(false);
  };

  // --- Loading & Not Found states ---
  if (!currentUser) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen"
        style={{ background: '#fafaf9' }}
      >
        <p style={{ color: '#57534e', fontFamily: "'DM Sans', sans-serif" }}>Please login to view profiles</p>
      </div>
    );
  }

  if (!isOwnProfile && profileUser === undefined) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen"
        style={{ background: '#fafaf9' }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent" style={{ borderColor: '#f59e0b' }}></div>
      </div>
    );
  }

  if (!isOwnProfile && profileUser === null) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen"
        style={{ background: '#fafaf9' }}
      >
        <p style={{ color: '#57534e', fontFamily: "'DM Sans', sans-serif" }}>User not found</p>
      </div>
    );
  }

  if (!displayUser) return null;

  return (
    <div 
      className="min-h-screen py-8"
      style={{ background: '#fafaf9', fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
      `}</style>
      <div className="max-w-2xl mx-auto px-4">
        <Card style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: '16px' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle 
                  className="syne"
                  style={{ color: '#1c1917', fontFamily: "'Syne', sans-serif" }}
                >
                  {isOwnProfile ? 'Profile Settings' : `${displayUser.name || displayUser.username || 'User'}'s Profile`}
                </CardTitle>
                <CardDescription style={{ color: '#57534e' }}>
                  {isOwnProfile ? 'Manage your username and avatar' : 'View user information'}
                </CardDescription>
              </div>
              
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/feed')}
                  className="flex items-center gap-2"
                  style={{ borderColor: '#e7e5e4', color: '#57534e', borderRadius: '12px' }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to My feed
                </Button>
              
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Display */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20" style={{ border: '2px solid #e7e5e4' }}>
                <AvatarImage src={displayUser.avatar} alt={displayUser.username || displayUser.name || 'User'} />
                <AvatarFallback style={{ background: '#fef3c7', color: '#92400e' }}>
                  {displayUser.username?.charAt(0) || displayUser.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: '#1c1917', fontFamily: "'Syne', sans-serif" }}>
                  {displayUser.name || displayUser.username || 'Unknown'}
                </h3>
                <p className="text-sm" style={{ color: '#a8a29e' }}>@{displayUser.username || 'unknown'}</p>
                <p className="text-sm" style={{ color: '#57534e' }}>{displayUser.email || 'No email'}</p>
              </div>
            </div>

            {/* Private Polls Section */}
            {isOwnProfile && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-t pt-6" style={{ borderColor: '#e7e5e4' }}>
                  <Lock className="w-4 h-4" style={{ color: '#d97706' }} />
                  <h4 className="text-lg font-semibold syne" style={{ color: '#1c1917', fontFamily: "'Syne', sans-serif" }}>
                    My Private Polls
                  </h4>
                </div>
                
                {privatePollsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent" style={{ borderColor: '#f59e0b' }}></div>
                  </div>
                ) : privatePolls.length === 0 ? (
                  <div className="text-center py-8" style={{ color: '#a8a29e' }}>
                    <Lock className="w-8 h-8 mx-auto mb-2" style={{ color: '#d97706' }} />
                    <p className="text-sm">You haven't created any private polls yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {privatePolls.map((poll) => (
                      <Card 
                        key={poll._id} 
                        style={{ borderLeft: '4px solid #d97706', background: '#fff', border: '1px solid #e7e5e4' }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium mb-2" style={{ color: '#1c1917' }}>{poll.description}</h5>
                              <div className="space-y-1">
                                {poll.options?.slice(0, 3).map((option, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm" style={{ color: '#57534e' }}>
                                    <div className="w-2 h-2 rounded-full" style={{ background: '#e7e5e4' }}></div>
                                    <span>{option.text}</span>
                                  </div>
                                ))}
                                {poll.options?.length > 3 && (
                                  <p className="text-xs" style={{ color: '#a8a29e' }}>+{poll.options.length - 3} more options</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs" style={{ color: '#d97706' }}>
                              <Eye className="w-3 h-3" />
                              <span>Private</span>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <p className="text-xs" style={{ color: '#a8a29e' }}>
                              Created {new Date(poll.createdAt).toLocaleDateString()}
                            </p>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate(`/poll/${poll._id}`)}
                              style={{ borderColor: '#e7e5e4', color: '#57534e', borderRadius: '8px' }}
                            >
                              View Poll
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Edit Section */}
            {isOwnProfile && (
              <>
                {!isEditing ? (
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => setIsEditing(true)} 
                      variant="outline"
                      style={{ borderColor: '#e7e5e4', color: '#57534e', borderRadius: '12px' }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          validateUsername(e.target.value);
                        }}
                        placeholder="Enter username"
                        maxLength={20}
                        className={usernameError ? "border-red-500" : ""}
                      />
                      {usernameError && (
                        <p className="text-sm text-red-500">{usernameError}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label style={{ color: '#1c1917' }}>Choose Avatar</Label>
                      <div className="grid grid-cols-6 gap-3">
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
                            <Avatar className="w-12 h-12">
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

                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSave} 
                        disabled={loading || usernameError}
                        className="syne font-semibold text-white hover:opacity-90"
                        style={{ background: '#1c1917', borderRadius: '12px', fontFamily: "'Syne', sans-serif" }}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleCancel}
                        style={{ borderColor: '#e7e5e4', color: '#57534e', borderRadius: '12px' }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
