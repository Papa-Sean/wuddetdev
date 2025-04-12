'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../../ui/button';
import { LogOut } from 'lucide-react';

interface NavigationProps {
	isLoggedIn: boolean;
	isAdmin: boolean;
	isLoading: boolean;
	userName?: string;
}

export function Navigation({
	isLoggedIn,
	isAdmin,
	isLoading,
	userName,
}: NavigationProps) {
	const { logout } = useAuth();

	const handleLogout = async () => {
		await logout();
	};

	return (
		<nav className='hidden md:flex items-center gap-8'>
			<NavLink href='/'>Home</NavLink>
			<NavLink href='/portfolio'>Portfolio</NavLink>
			<NavLink href='/merch'>Merch</NavLink>
			<NavLink href='/say-what-up-doe'>Say What Up Doe</NavLink>

			{isLoading ? (
				<div className='h-9 w-20 bg-muted/50 animate-pulse rounded-full'></div>
			) : isLoggedIn ? (
				<div className='flex items-center gap-2'>
					<div className='text-sm'>
						Hello,{' '}
						<span className='font-medium'>
							{userName || 'User'}
						</span>
					</div>
					{isAdmin && (
						<Link href='/admin'>
							<Button
								variant='outline'
								size='sm'
								className='mr-2'
							>
								Admin
							</Button>
						</Link>
					)}
					<Button
						variant='ghost'
						size='sm'
						onClick={handleLogout}
						className='text-accent hover:text-accent/80 flex items-center gap-1'
					>
						<LogOut size={16} />
						Log Out
					</Button>
				</div>
			) : (
				<div className='flex gap-2'>
					<Link href='/login'>
						<Button
							variant='outline'
							className='rounded-full'
						>
							Log In
						</Button>
					</Link>
					<Link href='/signup'>
						<Button className='rounded-full'>Sign Up</Button>
					</Link>
				</div>
			)}
		</nav>
	);
}

interface NavLinkProps {
	href: string;
	children: React.ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
	return (
		<Link
			href={href}
			className='text-sm font-medium hover:text-primary transition-colors relative group'
		>
			{children}
			<span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full'></span>
		</Link>
	);
}
