import React, { useEffect, useState } from 'react'
import { Plus } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, Lock, Users } from "lucide-react"
import { apiRequest } from "@/api"
import { toast } from 'sonner'

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const CreatePoll = ({ onPollCreated }) => {
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useState(null)
  const [isPrivate, setIsPrivate] = useState(false)
  const [privateKey, setPrivateKey] = useState("")
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [duration, setDuration] = useState('24 hours') // Default 24 hours


  useEffect(()=>{
    async function getProfile(){const profile = await apiRequest("GET", "/profile/check")
    setProfile(profile.data)
  
  }
    getProfile()
  },[])
  const handleAddOption = () => {
    if (options.length < 4) setOptions([...options, ""])
  }

  const handleChangeOption = (index, value) => {
    const updated = [...options]
    updated[index] = value
    setOptions(updated)
  }

  const generatePrivateKey = () => {
    return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast("Private key copied to clipboard!")
  }

  const closeDialog = () => {
    setIsOpen(false)
    setShowPrivateKey(false)
    setPrivateKey("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!question.trim() || options.some(opt => !opt.trim())) {
      toast.error('Please fill in all fields')
      return
    }
    
    const validOptions = options.filter(opt => opt.trim())
    if (validOptions.length < 2) {
      toast("Please fill in at least 2 options")
      return
    }

    const generatedKey = isPrivate ? generatePrivateKey() : ""
    const Poll = {
      description: question,
      options: options.filter(opt => opt.trim()),
      isPrivate: isPrivate,
      allowedUsers: [],
      privateKey: generatedKey,
      expiryDuration: duration
    }

    try {
      const response = await apiRequest("POST", "/polls/poll", Poll)
      // Poll created:
      
      if (isPrivate && response.data?.poll) {
        setPrivateKey(generatedKey)
        setShowPrivateKey(true)
      }
      
      if (response.data?.poll) {
        onPollCreated(response.data.poll)
      } else {
        onPollCreated()
      }
      
      setQuestion("")
      setOptions(["", ""])
      setIsPrivate(false)
      
      if (!isPrivate) {
        setIsOpen(false)
      }
      
      toast(`${isPrivate ? 'Private' : 'Public'} poll created successfully!`)
    } catch (error) {
      console.error('Error creating poll:', error)
      toast("Error creating poll")
    }
  }

  return (
    <div className="w-full">
      <Item 
        variant="outline" 
        className="w-full hover:shadow-md transition-shadow"
        style={{ border: '1px solid #e7e5e4', borderRadius: '16px', background: '#fafaf9' }}
      >
        <ItemMedia>
          <Avatar className="size-9" style={{ border: '2px solid #e7e5e4' }}>
            <AvatarImage src={profile?.avatar} />
            <AvatarFallback style={{ background: '#fef3c7', color: '#92400e' }}>ER</AvatarFallback>
          </Avatar>
        </ItemMedia>

        <ItemContent>
          <ItemTitle className="text-sm font-medium" style={{ color: '#1c1917', fontFamily: "'Syne', sans-serif" }}>
            {profile?.username}
          </ItemTitle>
          <ItemDescription className="text-xs sm:text-sm" style={{ color: '#57534e' }}>
            Add a new poll. {isPrivate ? "Private - share key with selected users" : "Anyone can vote!"}
          </ItemDescription>
        </ItemContent>

        <ItemActions>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                size="icon-sm"
                variant="outline"
                className="rounded-full transition-colors hover:opacity-80"
                style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e' }}
                aria-label="Add Poll"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>

            <DialogContent 
              className="sm:max-w-[500px] w-[95vw] max-w-[95vw]"
              style={{ borderRadius: '20px', border: '1px solid #e7e5e4', background: '#fff' }}
            >
              {!showPrivateKey ? (
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {isPrivate ? <Lock className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                      Create {isPrivate ? 'Private' : 'Public'} Poll
                    </DialogTitle>
                    <DialogDescription>
                      {isPrivate 
                        ? "Create a private poll. Only users with the access key can vote."
                        : "Write your question and add up to 4 options."
                      }
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 mt-4 p-1 max-h-[70vh] overflow-y-auto">
                    <div className="grid gap-2">
                      <Label htmlFor="question" className="text-sm font-medium" style={{ color: '#57534e' }}>
                        Question
                      </Label>
                      <Input
                        id="question"
                        placeholder="Type your question..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full focus:ring-amber-500 focus:border-amber-500"
                        style={{ background: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '12px' }}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-sm font-medium" style={{ color: '#57534e' }}>Options</Label>
                      {options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) =>
                              handleChangeOption(index, e.target.value)
                            }
                            className="flex-1 focus:ring-amber-500 focus:border-amber-500"
                            style={{ background: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '12px' }}
                          />
                        </div>
                      ))}
                      {options.length < 4 && (
                        <button
                          type="button"
                          onClick={handleAddOption}
                          className="text-sm font-medium transition-colors hover:underline"
                          style={{ color: '#d97706' }}
                        >
                          + Add another option
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                        <div 
                          className="flex items-center space-x-3 p-2 rounded-lg"
                          style={{ background: '#f5f4f2' }}
                        >
                        <Checkbox
                          id="private"
                          checked={isPrivate}
                          onCheckedChange={setIsPrivate}
                        />
                        <Label
                          htmlFor="private"
                          className="flex items-center gap-2"
                          style={{ color: '#57534e' }}
                        >
                          <Lock className="h-4 w-4" style={{ color: '#92400e' }} />
                          Make this poll private
                        </Label>
                      </div>
                      <div className="space-y-3 pt-2">
                        <Label htmlFor="duration" style={{ color: '#57534e', fontSize: '14px', fontWeight: 500 }}>Poll Duration</Label>
                        <select
                          id="duration"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full p-2 focus:ring-amber-500 focus:border-amber-500"
                          style={{ background: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '12px' }}
                        >
                          <option value="24 hours">24 hours</option>
                          <option value="3 days">3 days</option>
                          <option value="5 days">5 days</option>
                          <option value="7 days">7 days</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="mt-4 gap-2">
                    <DialogClose asChild>
                      <Button 
                        variant="outline" 
                        className="flex-1 hover:opacity-80"
                        style={{ border: '1.5px solid #e7e5e4', borderRadius: '12px', color: '#57534e' }}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button 
                      type="submit" 
                      className="flex-1 text-white syne font-semibold hover:opacity-90"
                      style={{ background: '#1c1917', borderRadius: '12px' }}
                    >
                      Create {isPrivate ? 'Private' : 'Public'} Poll
                    </Button>
                  </DialogFooter>
                </form>
              ) : (
                <div>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Private Poll Created!
                    </DialogTitle>
                    <DialogDescription>
                      Share this access key with users you want to invite to your private poll.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-4">
                    <Label className="text-sm font-medium">Private Access Key</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        value={privateKey}
                        readOnly
                        className="font-mono text-center"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(privateKey)}
                        className="px-3"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Keep this key safe. Anyone with this key can join your private poll.
                    </p>
                  </div>

                  <DialogFooter className="mt-4 gap-2">
                    <Button onClick={closeDialog} className="w-full">
                      Done
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        closeDialog()
                        window.location.href = '/my-polls'
                      }} 
                      className="w-full"
                    >
                      View My Polls
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </ItemActions>
      </Item>
    </div>
  )
}

export default CreatePoll
