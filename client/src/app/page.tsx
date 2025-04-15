'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { fetchSiteStats } from '@/lib/api/stats';
import {
	TypographyH1,
	TypographyH2,
	TypographyLead,
} from '@/components/ui/typography';
import { MidCenturyCard } from '@/components/ui/mid-century-card';
import { Starburst } from '@/components/ui/starburst';

export default function Home() {
	const { isAuthenticated, user } = useAuth();
	const isAdmin = user?.role === 'admin';

	// Add state for site statistics
	const [stats, setStats] = useState({
		activeUsers: 100, // Default values
		events: 25,
		projects: 50,
	});

	const [isLoading, setIsLoading] = useState(true);

	// Fetch stats on component mount
	useEffect(() => {
		async function loadStats() {
			try {
				const data = await fetchSiteStats();
				setStats(data);
			} catch (error) {
				console.error('Failed to load stats:', error);
				// Keep default values on error
			} finally {
				setIsLoading(false);
			}
		}

		loadStats();
	}, []);

	return (
		<div className='container mx-auto px-4 py-8'>
			{/* Hero Section with Mid-Century Typography */}
			<section className='py-16 md:py-24 relative'>
				{/* Decorative elements */}
				<div className='absolute -z-10 top-1/4 right-1/4 w-40 h-40 bg-primary/10 rounded-full blur-2xl'></div>
				<div className='absolute -z-10 bottom-1/3 -left-20 w-80 h-40 bg-secondary/10 rounded-full blur-3xl'></div>

				<div className='max-w-4xl mx-auto text-center'>
					<div className='mb-8 flex justify-center'>
						<Starburst className='text-primary' />
					</div>

					<TypographyH1 className='mb-6'>
						Welcome to{' '}
						<span className='text-accent text-shadow-lg text-shadow-primary'>
							wuddevdet
						</span>
						<span className='text-accent text-shadow-lg text-shadow-primary'>
							.
						</span>
						<span className='text-accent text-shadow-lg text-shadow-primary'>
							com
						</span>
						<br />
						<span className='relative inline-block'>
							Detroit's Web Dev Hub
							<span className='absolute -bottom-1 left-0 w-full h-0.5 bg-primary'></span>
						</span>
					</TypographyH1>

					<TypographyLead className='mb-10 text-primary'>
						Connect with Michigan developers, share events, and grow
						together.
					</TypographyLead>

					{/* Role-based CTAs */}
					{!isAuthenticated ? (
						<Link
							href='/signup'
							className='max-w-fit rounded-full bg-primary text-secondary border border-secondary px-6 py-3 sm:text-lg text-sm font-medium hover:bg-primary/90 transition-colors'
						>
							Join the Community → Sign Up
						</Link>
					) : (
						<Link
							href='/say-what-up-doe'
							className='max-w-fit rounded-full bg-primary text-primary-foreground px-6 py-3 sm:text-lg text-xs font-medium hover:bg-primary/90 transition-colors'
						>
							Check the latest events → Say What Up Doe
						</Link>
					)}
				</div>
			</section>

			{/* Interactive Map Section */}
			<section className='py-12 md:py-16'>
				<div className='max-w-4xl mx-auto'>
					<TypographyH2 className='mb-8 text-center'>
						Our Community in{' '}
						<span className='text-primary'>Southeast Michigan</span>
					</TypographyH2>

					<div className='bg-muted rounded-lg aspect-video relative overflow-hidden pattern-atomic'>
						{/* This would be replaced with an actual interactive map component */}
						<div className='absolute inset-0 flex items-center justify-center'>
							<iframe
								src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.8930883216303!2d-83.0389924!3d42.344802699999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8824d33fa4975911%3A0xad0e213807daa092!2sTocororo!5e0!3m2!1sen!2sus!4v1744477084228!5m2!1sen!2sus'
								className='border-none w-full h-full'
								loading='lazy'
							></iframe>
						</div>
					</div>
				</div>
			</section>

			{/* Preview Cards Section */}
			<section className='py-12 md:py-16'>
				<div className='max-w-6xl mx-auto'>
					<TypographyH2 className='mb-8 text-center'>
						Explore What{' '}
						<span className='text-primary'>We Offer</span>
					</TypographyH2>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						{/* Portfolio Card */}
						<MidCenturyCard
							color='secondary'
							className='transition-transform bg-secondary/50 hover:scale-105 hover:bg-secondary/90 shadow-lg'
						>
							<div className='h-48 flex items-center justify-center'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='48'
									height='48'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='text-primary'
								>
									<rect
										width='7'
										height='7'
										x='3'
										y='3'
										rx='1'
									/>
									<rect
										width='7'
										height='7'
										x='14'
										y='3'
										rx='1'
									/>
									<rect
										width='7'
										height='7'
										x='14'
										y='14'
										rx='1'
									/>
									<rect
										width='7'
										height='7'
										x='3'
										y='14'
										rx='1'
									/>
								</svg>
							</div>
							<div className='mt-4'>
								<h3 className='text-xl font-bold mb-2 tracking-tight'>
									Portfolio
								</h3>
								<p className='text-primary mb-4'>
									Explore the works of talented developers in
									our community.
								</p>
								<Link
									href='/portfolio'
									className='text-primary font-medium hover:underline'
								>
									View Projects →
								</Link>
							</div>
						</MidCenturyCard>

						{/* Merch Card */}
						<MidCenturyCard
							color='secondary'
							className='transition-transform bg-secondary/50 hover:scale-105 hover:bg-secondary/90 shadow-lg'
						>
							<div className='h-48 flex items-center justify-center'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='48'
									height='48'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='text-primary'
								>
									<path d='M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z' />
								</svg>
							</div>
							<div className='mt-4'>
								<h3 className='text-xl font-bold mb-2 tracking-tight'>
									Merch
								</h3>
								<p className='text-primary mb-4'>
									Show your Detroit dev pride with our branded
									apparel.
								</p>
								<Link
									href='/merch'
									className='text-primary font-medium hover:underline'
								>
									Shop Now →
								</Link>
							</div>
						</MidCenturyCard>

						{/* Say What Up Doe Card */}
						<MidCenturyCard
							color='secondary'
							className='transition-transform bg-secondary/50 hover:scale-105 hover:bg-secondary/90 shadow-lg'
						>
							<div className='h-48 flex items-center justify-center'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='48'
									height='48'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='text-primary'
								>
									<path d='M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z' />
									<path d='M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1' />
								</svg>
							</div>
							<div className='mt-4'>
								<h3 className='text-xl font-bold mb-2 tracking-tight'>
									Say What Up Doe
								</h3>
								<p className='text-primary mb-4'>
									Connect with the community and participate
									in local events.
								</p>
								<Link
									href='/say-what-up-doe'
									className='text-primary font-medium hover:underline'
								>
									Join the Conversation →
								</Link>
							</div>
						</MidCenturyCard>
					</div>
				</div>
			</section>

			{/* Community Stats Section with Mid-Century Pattern */}
			<section className='py-12 md:py-16 my-12 relative overflow-hidden'>
				<div className='absolute inset-0 pattern-dots opacity-10 -z-10'></div>
				<div className='max-w-6xl mx-auto px-4'>
					<TypographyH2 className='mb-8 text-center'>
						Our <span className='text-primary'>Growing</span>{' '}
						Community
					</TypographyH2>

					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center'>
						<div className='bg-card p-6 rounded-lg border-l-4 border-primary'>
							<p className='text-4xl font-bold text-primary mb-2'>
								{isLoading ? '...' : `${stats.activeUsers}+`}
							</p>
							<p className='text-muted-foreground'>
								Active Members
							</p>
						</div>
						<div className='bg-card p-6 rounded-lg border-l-4 border-secondary'>
							<p className='text-4xl font-bold text-secondary mb-2'>
								{isLoading ? '...' : `${stats.events}+`}
							</p>
							<p className='text-muted-foreground'>Events</p>
						</div>
						<div className='bg-card p-6 rounded-lg border-l-4 border-accent'>
							<p className='text-4xl font-bold text-accent mb-2'>
								{isLoading ? '...' : `${stats.projects}+`}
							</p>
							<p className='text-muted-foreground'>
								Projects Showcased
							</p>
						</div>
						<div className='bg-card p-6 rounded-lg border-l-4 border-primary'>
							<Link
								href='/say-what-up-doe'
								className='block hover:opacity-90 transition-opacity'
							>
								<p className='text-primary font-bold mb-2 flex items-center justify-center'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										className='mr-2'
									>
										<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
										<circle
											cx='9'
											cy='7'
											r='4'
										/>
										<path d='M22 21v-2a4 4 0 0 0-3-3.87' />
										<path d='M16 3.13a4 4 0 0 1 0 7.75' />
									</svg>
									Join Us
								</p>
								<p className='text-muted-foreground'>
									Become a Partner
								</p>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
