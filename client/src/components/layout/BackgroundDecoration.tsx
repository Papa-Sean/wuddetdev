export function BackgroundDecoration() {
	return (
		<div className='fixed inset-0 -z-10 overflow-hidden'>
			{/* Starburst shape */}
			<div className='absolute -top-10 -left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl'></div>
			{/* Atomic dot pattern */}
			<div className='absolute top-1/4 right-1/4 w-40 h-40 bg-primary/10 rounded-full blur-2xl'></div>
			{/* Boomerang shape */}
			<div className='absolute bottom-1/3 -left-20 w-80 h-40 bg-secondary/10 rounded-full blur-3xl'></div>
		</div>
	);
}
