import Link from 'next/link';

export function Logo() {
	return (
		<Link
			href='/'
			className='font-bold text-2xl bg-primary rounded-full px-4 py-2 tracking-tight flex items-center gap-2'
		>
			<div className='text-secondary'>wud</div>
			<div className='text-accent'>dev</div>
			<div className='text-secondary'>det</div>
		</Link>
	);
}
