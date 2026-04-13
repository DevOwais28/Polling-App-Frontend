import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/api";
import { toast } from 'sonner';

const JoinPrivatePoll = () => {
  const [privateKey, setPrivateKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoinPoll = async (e) => {
    e.preventDefault();

    if (!privateKey.trim()) {
      toast("Please enter a private access key");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/polls/join-private", { privateKey });

      if (response.data?.poll) {
        // Store the key in sessionStorage
        sessionStorage.setItem(`poll_${response.data.poll._id}_key`, privateKey);

        toast.success("Successfully joined private poll!");
        navigate(`/poll/${response.data.poll._id}`);
      } else {
        toast.error("Invalid or expired access key");
      }
    } catch (error) {
      console.error('Error joining private poll:', error);
      toast.error(error.response?.data?.message || "Failed to join private poll");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: '#fafaf9', fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Google Font Loader */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
      `}</style>
      <Card 
        className="w-full max-w-md"
        style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: '16px' }}
      >
        <CardHeader className="text-center">
          <div 
            className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{ background: '#fef3c7' }}
          >
            <Lock className="h-6 w-6" style={{ color: '#d97706' }} />
          </div>
          <CardTitle 
            className="text-2xl font-bold syne"
            style={{ color: '#1c1917', fontFamily: "'Syne', sans-serif" }}
          >
            Join Private Poll
          </CardTitle>
          <CardDescription style={{ color: '#57534e' }}>
            Enter the private access key to join an exclusive WePollin poll
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleJoinPoll} className="space-y-4">
            <div className="space-y-2">
              <Label 
                htmlFor="privateKey" 
                className="text-sm font-medium"
                style={{ color: '#1c1917' }}
              >
                Private Access Key
              </Label>
              <Input
                id="privateKey"
                type="text"
                placeholder="Enter the access key..."
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                disabled={isLoading}
                style={{ 
                  borderColor: '#e7e5e4', 
                  borderRadius: '12px',
                  fontFamily: "'DM Sans', sans-serif"
                }}
              />
              <p className="text-xs" style={{ color: '#a8a29e' }}>
                The access key should be a 16-character alphanumeric code
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full syne font-semibold text-white hover:opacity-90"
              disabled={isLoading || !privateKey.trim()}
              style={{ 
                background: '#1c1917', 
                borderRadius: '12px',
                fontFamily: "'Syne', sans-serif"
              }}
            >
              {isLoading ? "Joining..." : <>Join Private Poll <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: '#57534e' }}>Don't have an access key?</p>
            <Button
              variant="link"
              onClick={() => navigate('/feed')}
              className="text-sm p-0 h-auto hover:opacity-80"
              style={{ color: '#d97706' }}
            >
              Browse public polls
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinPrivatePoll;
