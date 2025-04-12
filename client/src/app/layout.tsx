import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { BackgroundDecoration } from '@/components/layout/BackgroundDecoration';
import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
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
	title: "wuddevdet | Detroit's Web Dev Hub",
	description:
		'Connect with Michigan developers, share events, and grow together.',
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
				<AuthProvider>
					<BackgroundDecoration />
					<Header />
					<main className='flex-1 relative'>{children}</main>
					<Footer />
				</AuthProvider>
			</body>
		</html>
	);
}
