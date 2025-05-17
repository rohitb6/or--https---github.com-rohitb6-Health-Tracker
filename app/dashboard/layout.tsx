'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Activity, Droplet, Brain, Dumbbell, Heart, Scale, Moon } from "lucide-react";
import { ColorfulBackground } from '@/components/ui/colorful-background';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Mood Tracker', href: '/dashboard/mood', icon: Brain },
  { name: 'Water Intake', href: '/dashboard/water', icon: Droplet },
  { name: 'Breathing', href: '/dashboard/breathing', icon: Activity },
  { name: 'Meal Log', href: '/dashboard/meals', icon: Activity },
  { name: 'Sleep Tracker', href: '/dashboard/sleep', icon: Moon },
  { name: 'Fitness', href: '/dashboard/fitness', icon: Dumbbell },
  { name: 'Stretching', href: '/dashboard/stretching', icon: Activity },
  { name: 'Mental Health', href: '/dashboard/mental', icon: Heart },
  { name: 'Weight Tracker', href: '/dashboard/weight', icon: Scale },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(auth === 'true');
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    window.location.href = '/auth/login';
    return null;
  }

  return (
    <ColorfulBackground>
      <div className="flex h-screen">
        {/* Mobile sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50 bg-white/10 backdrop-blur-sm">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-white/10 backdrop-blur-lg border-r border-white/20">
            <ScrollArea className="h-full py-6">
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold text-white">Navigation</h2>
                <div className="space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Desktop sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-grow bg-white/10 backdrop-blur-lg border-r border-white/20">
            <div className="flex items-center h-16 flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-white">Health Tracker</h1>
            </div>
            <ScrollArea className="flex-1">
              <div className="px-3 py-2">
                <div className="space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 md:pl-64">
          <main className="p-4 md:p-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white/20">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ColorfulBackground>
  );
} 