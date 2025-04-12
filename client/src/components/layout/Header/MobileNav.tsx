'use client';

import Link from 'next/link';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet';

interface MobileNavProps {
	isLoggedIn: boolean;
	isAdmin: boolean;
	isLoading: boolean;
	userName?: string;
}

export function MobileNav({
	isLoggedIn,
	isAdmin,
	isLoading,
	userName,
}: MobileNavProps) {
	const { logout } = useAuth();

	const handleLogout = async () => {
		await logout();
	};

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant='ghost'
					size='sm'
					className='md:hidden'
				>
					<Menu />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<div className='flex flex-col gap-6 mt-10'>
					<Link
						href='/'
						className='text-lg font-medium hover:text-primary transition-colors'
					>
						Home
					</Link>
					<Link
						href='/portfolio'
						className='text-lg font-medium hover:text-primary transition-colors'
					>
						Portfolio
					</Link>
					<Link
						href='/merch'
						className='text-lg font-medium hover:text-primary transition-colors'
					>
						Merch
					</Link>
					<Link
						href='/say-what-up-doe'
						className='text-lg font-medium hover:text-primary transition-colors'
					>
						Say What Up Doe
					</Link>

					{isLoading ? (
						<div className='h-10 bg-muted/50 animate-pulse rounded-full'></div>
					) : isLoggedIn ? (
						<>
							<div className='py-2 text-sm'>
								Hello,{' '}
								<span className='font-medium'>
									{userName || 'User'}
								</span>
							</div>
							{isAdmin && (
								<Link href='/admin'>
									<Button
										className='w-full'
										variant='outline'
									>
										Admin Dashboard
									</Button>
								</Link>
							)}
							<Button
								variant='ghost'
								onClick={handleLogout}
								className='text-accent hover:text-accent/80 flex items-center gap-2 justify-center'
							>
								<LogOut size={16} />
								Log Out
							</Button>
						</>
					) : (
						<div className='flex flex-col gap-3'>
							<Link href='/login'>
								<Button
									variant='outline'
									className='w-full'
								>
									Log In
								</Button>
							</Link>
							<Link href='/signup'>
								<Button className='w-full'>Sign Up</Button>
							</Link>
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
