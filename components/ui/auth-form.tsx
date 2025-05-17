import { useState, FormEvent, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (data: AuthFormData) => void;
  isLoading?: boolean;
}

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
}

export function AuthForm({ type, onSubmit, isLoading = false }: AuthFormProps) {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="w-full border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-bold text-center">
          {type === 'login' ? 'Welcome Back' : 'Create Account'}
        </CardTitle>
        <CardDescription className="text-center">
          {type === 'login' 
            ? 'Sign in to access your health dashboard'
            : 'Join us to start tracking your health journey'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 px-0">
          {type === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="bg-white/50 backdrop-blur-sm"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="bg-white/50 backdrop-blur-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="bg-white/50 backdrop-blur-sm"
            />
          </div>
        </CardContent>
        <CardFooter className="px-0">
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {type === 'login' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              type === 'login' ? 'Sign In' : 'Create Account'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 