'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User } from 'lucide-react';

export function FooterLinks() {
	const { isAuthenticated } = useAuth();

	return (
		<div>
			<h3 className='font-bold mb-4 text-secondary'>Links</h3>
			<ul className='space-y-3'>
				<li>
					<Link
						href='/'
						className='hover:text-accent text-secondary transition-colors'
					>
						Home
					</Link>
				</li>
				<li>
					<Link
						href='/portfolio'
						className='hover:text-accent text-secondary transition-colors'
					>
						Portfolio
					</Link>
				</li>
				<li>
					<Link
						href='/merch'
						className='hover:text-accent text-secondary transition-colors'
					>
						Merch
					</Link>
				</li>
				<li>
					<Link
						href='/say-what-up-doe'
						className='hover:text-accent text-secondary transition-colors'
					>
						Say What Up Doe
					</Link>
				</li>
				{isAuthenticated && (
					<li>
						<Link
							href='/profile'
							className='hover:text-accent text-secondary transition-colors flex items-center gap-1'
						>
							<User size={14} />
							<span>Profile</span>
						</Link>
					</li>
				)}
			</ul>
		</div>
	);
}
