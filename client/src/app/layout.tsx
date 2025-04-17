import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { BackgroundDecoration } from '@/components/layout/BackgroundDecoration';
import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import { trackPageView } from '@/lib/analytics/tracker';
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker';
import { GoogleAnalytics } from '@next/third-parties/google';
import '@/styles/mid-century-patterns.css';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: {
		default: "wuddevdet | Detroit's Web Dev Hub",
		template: '%s | wuddevdet',
	},
	description:
		'Connect with Michigan developers, share events, and grow together.',
	manifest: '/manifest.json',
	metadataBase: new URL('https://wuddevdet.com'),
	openGraph: {
		type: 'website',
		siteName: 'wuddevdet',
		title: "wuddevdet | Detroit's Web Dev Hub",
		description:
			'Connect with Michigan developers, share events, and grow together.',
		images: [
			{
				url: '/og-image.jpg',
				width: 1200,
				height: 630,
				alt: "wuddevdet - Detroit's Web Dev Hub",
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: "wuddevdet | Detroit's Web Dev Hub",
		description:
			'Connect with Michigan developers, share events, and grow together.',
		images: ['/og-image.jpg'],
	},
};

export const viewport: Viewport = {
	themeColor: '#59461E',
	width: 'device-width',
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gradient-to-t from-primary/10 to-secondary/10`}
			>
				{/* Add Google Analytics with your measurement ID */}
				<GoogleAnalytics gaId='G-YR80C8ZDM0' />

				<AuthProvider>
					<AnalyticsTracker />
					<BackgroundDecoration />
					<Header />
					<main className='flex-1 relative'>{children}</main>
					<Footer />
				</AuthProvider>
			</body>
		</html>
	);
}
