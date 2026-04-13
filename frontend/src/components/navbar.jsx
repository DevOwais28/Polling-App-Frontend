import React from 'react';
import { Link, useLocation } from "react-router-dom";
import SearchBar from "./searchBar";
import NotificationsBell from "./NotificationsBell";
import { Menu, User, Settings, BarChart3, Vote, Home, Lock, Archive, ArrowUpRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useAppStore from "@/store";

const Navbar = () => {
  const location = useLocation();
  const user = useAppStore((state) => state.user);
  
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
  const isAuthPage = isLoginPage || isSignupPage;
  const isFeed = location.pathname === '/feed' || location.pathname.startsWith('/my-polls') || location.pathname.startsWith('/voted-polls');

  return (
    <header 
      className="sticky top-0 z-50"
      style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e7e5e4' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: '#1c1917' }}
              >
                <BarChart3 className="w-5 h-5" style={{ color: '#fbbf24' }} />
              </div>
              <span 
                className="text-xl font-bold syne hidden sm:inline"
                style={{ color: '#1c1917', fontFamily: "'Syne', sans-serif" }}
              >
                WePollin
              </span>
              <span 
                className="text-lg font-bold syne sm:hidden"
                style={{ color: '#1c1917', fontFamily: "'Syne', sans-serif" }}
              >
                WP
              </span>
            </Link>
            {isFeed && (
              <div className="hidden md:block ml-8">
                <SearchBar />
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {!isAuthPage && (
              <>
                {user ? (
                  <>
                    <Link 
                      to="/join-private" 
                      className="text-sm font-medium transition-colors flex items-center gap-1 hover:text-amber-600"
                      style={{ color: '#57534e' }}
                    >
                      <Lock className="w-4 h-4" />
                      Join Private
                    </Link>
                    <NotificationsBell />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-sm font-medium hover:text-amber-600 hidden sm:inline-flex"
                      style={{ color: '#57534e' }}
                      onClick={() => {
                        useAppStore.getState().clearUser();
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/';
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="text-sm font-medium transition-colors hover:text-amber-600 hidden sm:inline"
                      style={{ color: '#57534e' }}
                    >
                      Sign In
                    </Link>
                    <Link to="/signup">
                      <Button 
                        className="syne font-semibold text-xs sm:text-sm text-white hover:opacity-90 transition-opacity whitespace-nowrap"
                        style={{ background: '#1c1917', borderRadius: '12px', padding: '6px 10px' }}
                      >
                        <span className="hidden sm:inline">Get Started</span>
                        <span className="sm:hidden">Start</span>
                        <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Mobile Notifications + Menu */}
          <div className="md:hidden flex items-center gap-2">
            <NotificationsBell />
            <Sheet>
              <SheetTrigger asChild>
                <button 
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: '#57534e' }}
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72" style={{ background: '#fff', borderLeft: '1px solid #e7e5e4' }}>
              <SheetHeader className="pb-2 mb-3" style={{ borderBottom: '1px solid #e7e5e4' }}>
                <div className="flex items-center justify-between">
                  <SheetTitle style={{ color: '#1c1917', fontFamily: "'Syne', sans-serif" }}>Menu</SheetTitle>
                </div>
              </SheetHeader>
              <div className="py-4 space-y-3">
                {isFeed && (
                  <div className="mb-4 px-1">
                    <SearchBar />
                  </div>
                )}
                {user ? (
                  <>
                    <Link to="/feed" className="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-amber-50">
                      <Home className="w-5 h-5" style={{ color: '#57534e' }} />
                      <span style={{ color: '#1c1917' }}>Feed</span>
                    </Link>
                    <Link to="/my-polls" className="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-amber-50">
                      <Vote className="w-5 h-5" style={{ color: '#57534e' }} />
                      <span style={{ color: '#1c1917' }}>My Polls</span>
                    </Link>
                    <Link to="/join-private" className="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-amber-50">
                      <Lock className="w-5 h-5" style={{ color: '#57534e' }} />
                      <span style={{ color: '#1c1917' }}>Join Private Poll</span>
                    </Link>
                    <Separator style={{ background: '#e7e5e4' }} />
                    <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-amber-50">
                      <User className="w-5 h-5" style={{ color: '#57534e' }} />
                      <span style={{ color: '#1c1917' }}>Profile</span>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left p-3 hover:bg-amber-50"
                      style={{ color: '#57534e' }}
                      onClick={() => {
                        useAppStore.getState().clearUser();
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/';
                      }}
                    >
                      <User className="w-5 h-5 mr-3" style={{ color: '#57534e' }} />
                      <span style={{ color: '#1c1917' }}>Logout</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-amber-50">
                      <User className="w-5 h-5" style={{ color: '#57534e' }} />
                      <span style={{ color: '#1c1917' }}>Sign In</span>
                    </Link>
                    <Link to="/signup" className="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-amber-50">
                      <User className="w-5 h-5" style={{ color: '#57534e' }} />
                      <span style={{ color: '#1c1917' }}>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
