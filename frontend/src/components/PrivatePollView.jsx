import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, Users, BarChart3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/api";
import { toast } from 'sonner';
import { io } from 'socket.io-client';
import { ShareButton } from './sharebutton';

const PrivatePollView = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [results, setResults] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [socket, setSocket] = useState(null);

  // Redirect if no private key
  useEffect(() => {
    const secretKey = sessionStorage.getItem(`poll_${pollId}_key`);
    if (!secretKey) {
      toast.error("You must enter the secret key first");
      navigate("/join-private");
    }
  }, [pollId, navigate]);

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profileResponse = await apiRequest("GET", "/profile/check");
        setUser(profileResponse.data);
      } catch (error) {
        toast.error('Failed to fetch user');
      }
    };
    fetchUser();
  }, []);

  // Fetch poll data
  useEffect(() => {
    const fetchPoll = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest("GET", `/polls/${pollId}`);
        if (response.data?.poll) {
          setPoll(response.data.poll);
          fetchVotes(response.data.poll);
        } else {
          toast.error("Poll not found");
          navigate("/join-private");
        }
      } catch (error) {
        toast.error("Failed to load poll");
        navigate("/join-private");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPoll();
  }, [pollId, navigate, user]);

  // Fetch votes
  const fetchVotes = async (pollData) => {
    try {
      const votesResponse = await apiRequest("GET", `/votes/vote/${pollId}`);
      const votes = votesResponse.data.votes || [];
      const total = votes.length;

      // Check vote of current user only
      const userVote = votes.find(v => v.user === user?._id || v.userId === user?._id);
      if (userVote) {
        setHasVoted(true);
        setSelectedOption(userVote.optionIndex);
      } else {
        setHasVoted(false);
        setSelectedOption(null);
      }

      const calculatedResults = pollData.options.map((option, index) => {
        const optionVotes = votes.filter(v => v.optionIndex === index).length;
        return {
          option,
          votes: optionVotes,
          percentage: total > 0 ? (optionVotes / total) * 100 : 0
        };
      });

      setResults(calculatedResults);
      setTotalVotes(total);
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  };

  // WebSocket setup
  useEffect(() => {
    if (!pollId || !user?._id || !poll) return;

    const socketBaseUrl = import.meta.env.VITE_API_URL || "https://polling-app-production-855d.up.railway.app";
    const newSocket = io(socketBaseUrl, {
      withCredentials: true,
      transports: ['websocket'],
      query: { pollId, userId: user._id }
    });

    newSocket.on('vote', (data) => {
      if (data.pollId === pollId) {
        setResults(data.results.map(r => ({ ...r, percentage: Math.round(r.percentage) })));
        setTotalVotes(data.totalVotes);

        if (data.voterId === user._id) {
          setHasVoted(true);
          setSelectedOption(data.voterOptionIndex);
        }
      }
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [pollId, user?._id, poll]);

  // Vote handler
  const handleVote = () => {
    if (selectedOption === null) return toast.error("Please select an option");
    if (hasVoted) return toast.error("You already voted");

    const newTotalVotes = totalVotes + 1;
    const updatedResults = results.map((result, index) => {
      if (index === selectedOption) {
        const newVotes = result.votes + 1;
        return { ...result, votes: newVotes, percentage: (newVotes / newTotalVotes) * 100 };
      }
      return { ...result, percentage: (result.votes / newTotalVotes) * 100 };
    });

    setResults(updatedResults);
    setTotalVotes(newTotalVotes);
    setHasVoted(true);

    if (socket) socket.emit('vote', { optionIndex: selectedOption });
    toast.success("Vote submitted!");
  };

  const handleGoBack = () => {
    sessionStorage.removeItem(`poll_${pollId}_key`);
    navigate('/feed');
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>;

  if (!poll) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md p-6 text-center">
        <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Poll Not Found</h3>
        <p className="text-gray-600 mt-2">This poll may not exist or you may not have access.</p>
        <Button onClick={handleGoBack} className="mt-4">Go Back</Button>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Feed
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Private Poll</span>
              </div>
              <ShareButton pollId={poll._id} pollDescription={poll.description} />
            </div>
            <CardTitle className="text-xl">{poll.description}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Exclusive access poll
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!hasVoted ? (
              <div className="space-y-3">
                <h4 className="font-medium">Cast Your Vote:</h4>
                {poll.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedOption === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedOption(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedOption === index ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {selectedOption === index && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                  </div>
                ))}
                <Button onClick={handleVote} disabled={selectedOption === null} className="w-full mt-4">Submit Vote</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium text-green-600">Live Results</h4>
                </div>
                {results.map((result, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{result.option}</span>
                      <span className="text-gray-600">{result.votes} votes ({result.percentage.toFixed(1)}%)</span>
                    </div>
                    <Progress value={result.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivatePollView;
