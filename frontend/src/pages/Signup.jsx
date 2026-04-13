import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "sonner";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { BarChart3, Sparkles, ArrowUpRight } from 'lucide-react';

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const initialValues = {
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  };
  const signupSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password Cannot be less than 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const data = {
          email: values?.email,
          password: values?.password,
          name: values?.name
        }
        const response = await apiRequest('POST', 'users/signup', data);
        if (response?.data) {
          navigate('/login');
          toast(response?.data.message);
          formik.resetForm();
        }
      } catch (error) {
        toast(error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  async function continueWithGoogle() {
    window.location.href = `${import.meta.env.VITE_API_URL || 'https://polling-app-production-a6f5.up.railway.app'}/api/auth/google`;
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authData = params.get("auth");
    const error = params.get("error");

    if (error) {
      toast.error('Authentication failed. Please try again.');
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }

    if (authData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(authData));
        if (parsed.login && parsed.token && parsed.user) {
          setToken(parsed.token);
          setUser(parsed.user);
          localStorage.setItem('token', parsed.token);
          localStorage.setItem('user', JSON.stringify(parsed.user));

          // Show welcome message for new users
          if (parsed.user.isNewUser) {
            toast.success('Welcome to WePollin! Your account has been created successfully.');
          } else {
            toast.success('Successfully logged in with Google');
          }

          // Navigate to feed and clean up URL
          navigate("/feed");
          window.history.replaceState({}, "", window.location.pathname);
        }
      } catch (error) {
        console.error('Error processing auth data:', error);
        toast.error('Failed to process authentication. Please try again.');
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, [navigate]);
  return (
    <div className="min-h-screen" style={{ background: '#fafaf9', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Google Font Loader */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
        .dm { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50" style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e7e5e4' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1c1917' }}>
                <BarChart3 className="w-5 h-5" style={{ color: '#fbbf24' }} />
              </div>
              <span className="text-xl font-bold syne hidden sm:inline" style={{ color: '#1c1917' }}>
                WePollin
              </span>
              <span className="text-lg font-bold syne sm:hidden" style={{ color: '#1c1917' }}>
                WP
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-sm font-medium transition-colors hover:text-amber-600 hidden sm:inline" style={{ color: '#57534e' }}>
                Sign In
              </Link>
              <Link to="/login">
                <Button 
                  className="syne font-semibold text-xs sm:text-sm whitespace-nowrap"
                  style={{ background: '#1c1917', color: '#fff', borderRadius: '12px', padding: '6px 10px' }}
                >
                  <span className="hidden sm:inline">Log in</span>
                  <span className="sm:hidden">Login</span>
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Signup Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="mb-4">
              <span 
                className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e' }}
              >
                <Sparkles className="w-3 h-3 mr-2" />
                Join WePollin
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2 syne" style={{ color: '#1c1917', letterSpacing: '-0.02em' }}>
              Create your account
            </h1>
            <p style={{ color: '#57534e' }}>
              Start creating amazing polls and engaging your audience today
            </p>
          </div>

          <Card className="w-full shadow-xl" style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: '20px' }}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl syne" style={{ color: '#1c1917' }}>Get started</CardTitle>
              <CardDescription style={{ color: '#57534e' }}>
                Join thousands of creators who trust WePollin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" style={{ color: '#57534e', fontSize: '14px', fontWeight: 500 }}>Full Name</Label>
                    <Input
                      id="name"
                      type="name"
                      name="name"
                      placeholder="John Doe"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      required
                      className="focus:ring-amber-500 focus:border-amber-500"
                      style={{ background: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '12px' }}
                    />
                    {formik.errors.name && formik.touched.name && (
                      <span className="text-sm" style={{ color: '#dc2626' }}>
                        {formik.errors.name}
                      </span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" style={{ color: '#57534e', fontSize: '14px', fontWeight: 500 }}>Email</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      required
                      className="focus:ring-amber-500 focus:border-amber-500"
                      style={{ background: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '12px' }}
                    />
                    {formik.errors.email && formik.touched.email && (
                      <span className="text-sm" style={{ color: '#dc2626' }}>
                        {formik.errors.email}
                      </span>
                    )}
                  </div>
                  <div className="grid gap-2 relative">
                    <Label htmlFor="password" style={{ color: '#57534e', fontSize: '14px', fontWeight: 500 }}>Password</Label>
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Create a strong password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      required
                      className="focus:ring-amber-500 focus:border-amber-500"
                      style={{ background: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '12px' }}
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-9 -translate-y-1/2 cursor-pointer"
                      style={{ color: '#a8a29e' }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    {formik.errors.password && formik.touched.password && (
                      <span className="text-sm" style={{ color: '#dc2626' }}>
                        {formik.errors.password}
                      </span>
                    )}
                  </div>
                  <div className="grid gap-2 relative">
                    <Label htmlFor="confirmPassword" style={{ color: '#57534e', fontSize: '14px', fontWeight: 500 }}>Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      required
                      className="focus:ring-amber-500 focus:border-amber-500"
                      style={{ background: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '12px' }}
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-9 -translate-y-1/2 cursor-pointer"
                      style={{ color: '#a8a29e' }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                      <span className="text-sm" style={{ color: '#dc2626' }}>
                        {formik.errors.confirmPassword}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <Link to="/login" className="text-sm font-medium hover:underline" style={{ color: '#d97706' }}>
                      Already have an account?
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button
                type="submit"
                className="w-full syne font-semibold text-white hover:opacity-90 transition-opacity"
                style={{ background: '#1c1917', borderRadius: '12px', padding: '12px 24px', boxShadow: '0 4px 16px rgba(28,25,23,0.18)' }}
                onClick={() => formik.submitForm()}
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full" style={{ borderTop: '1px solid #e7e5e4' }} />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2" style={{ background: '#fff', color: '#a8a29e' }}>Or continue with</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full hover:opacity-80 transition-opacity"
                style={{ border: '1.5px solid #e7e5e4', borderRadius: '12px', color: '#1c1917' }}
                onClick={() => continueWithGoogle()}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  )
}
