'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, LogOut, Home, Briefcase, ShoppingBag, MessageSquare, 
  ChevronDown, ChevronRight, User, Bell, Settings
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';

interface MobileNavProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  userName?: string;
}

interface NavSection {
  id: string;
  title: string;
  href: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
  adminOnly?: boolean;
}

export function MobileNav({
  isLoggedIn,
  isAdmin,
  isLoading,
  userName,
}: MobileNavProps) {
  const { logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<number>(isAdmin ? 3 : 0);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  // Define main navigation sections
  const mainNavSections: NavSection[] = [
    { id: 'home', title: 'Home', href: '/', icon: <Home size={18} /> },
    { id: 'portfolio', title: 'Portfolio', href: '/portfolio', icon: <Briefcase size={18} /> },
    { id: 'merch', title: 'Merch', href: '/merch', icon: <ShoppingBag size={18} /> },
    { id: 'say-what-up-doe', title: 'Say What Up Doe', href: '/say-what-up-doe', icon: <MessageSquare size={18} /> },
  ];

  // User-specific additional sections
  const userSections: NavSection[] = [
    { id: 'profile', title: 'My Profile', href: '/profile', icon: <User size={18} />, requiresAuth: true },
    { id: 'notifications', title: 'Notifications', href: '/notifications', icon: <Bell size={18} />, requiresAuth: true },
    { id: 'admin', title: 'Admin Dashboard', href: '/admin', icon: <Settings size={18} />, requiresAuth: true, adminOnly: true },
  ];
  
  // Close sheet when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Animation variants for menu items
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.3
      }
    }),
    exit: { opacity: 0, x: -20 }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='md:hidden relative'
        >
          <Menu />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0 overflow-y-auto">
        <div className="px-5 py-6">
          {isLoggedIn && !isLoading && (
            <div className="mb-6 flex items-center gap-4 p-3 rounded-lg bg-muted/30">
              <Avatar>
                {userName && <AvatarFallback>{userName.substring(0, 2)}</AvatarFallback>}
                <AvatarImage src="" />
              </Avatar>
              <div>
                <p className="font-medium">{userName || 'User'}</p>
                <p className="text-xs text-muted-foreground">{isAdmin ? 'Admin' : 'Member'}</p>
              </div>
            </div>
          )}

          <AnimatePresence>
            <div className="space-y-1">
              {/* Main Navigation Links */}
              {mainNavSections.map((section, i) => (
                <motion.div
                  key={section.id}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Link href={section.href}>
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "w-full justify-start gap-3 mb-1 text-base font-medium transition-all",
                        pathname === section.href ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                      )}
                    >
                      {section.icon}
                      {section.title}
                      {pathname === section.href && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-full"
                        />
                      )}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {/* User-Specific Sections */}
          {isLoggedIn && !isLoading && (
            <>
              <div className="h-px bg-border my-4" />
              <AnimatePresence>
                <div className="space-y-1">
                  {userSections
                    .filter(section => 
                      (!section.adminOnly || (section.adminOnly && isAdmin))
                    )
                    .map((section, i) => (
                      <motion.div
                        key={section.id}
                        custom={i + mainNavSections.length}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <Link href={section.href}>
                          <Button 
                            variant="ghost" 
                            className={cn(
                              "w-full justify-start gap-3 mb-1 text-base font-medium transition-all",
                              pathname === section.href ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                            )}
                          >
                            {section.icon}
                            {section.title}
                            {section.id === 'notifications' && notifications > 0 && (
                              <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {notifications}
                              </span>
                            )}
                          </Button>
                        </Link>
                      </motion.div>
                    ))
                  }
                </div>
              </AnimatePresence>
            </>
          )}

          {/* Auth Buttons */}
          <div className="mt-6">
            {isLoading ? (
              <div className="h-10 bg-muted/50 animate-pulse rounded-md" />
            ) : isLoggedIn ? (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 justify-center border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Log Out
              </Button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/login" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
