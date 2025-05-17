'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm, AuthFormData } from '@/components/ui/auth-form';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ColorfulBackground } from '@/components/ui/colorful-background';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (data: AuthFormData) => {
    try {
      setIsLoading(true);
      setError('');

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, accept any non-empty data
      if (!data.email || !data.password || !data.name) {
        throw new Error('Please fill in all fields');
      }

      // Store auth state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({ email: data.email, name: data.name }));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ColorfulBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Health Tracker
            </h1>
            <p className="mt-2 text-white/90">
              Start your health journey today
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-50/90 backdrop-blur-sm border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-white/20">
            <AuthForm type="signup" onSubmit={handleSignup} isLoading={isLoading} />
          </div>

          <p className="text-center text-sm text-white/90">
            Already have an account?{' '}
            <a href="/auth/login" className="font-medium text-white hover:text-blue-100 transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </ColorfulBackground>
  );
} 