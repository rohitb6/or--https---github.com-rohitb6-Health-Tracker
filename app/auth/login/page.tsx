'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/ui/auth-form';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ColorfulBackground } from '@/components/ui/colorful-background';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      setError('');

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, accept any non-empty email/password
      if (!data.email || !data.password) {
        throw new Error('Please enter both email and password');
      }

      // Store auth state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({ email: data.email }));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
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
              Track your health journey with ease
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-50/90 backdrop-blur-sm border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-white/20">
            <AuthForm type="login" onSubmit={handleLogin} isLoading={isLoading} />
          </div>

          <p className="text-center text-sm text-white/90">
            Don't have an account?{' '}
            <a href="/auth/signup" className="font-medium text-white hover:text-blue-100 transition-colors">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </ColorfulBackground>
  );
} 