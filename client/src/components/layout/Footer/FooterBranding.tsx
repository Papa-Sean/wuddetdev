export function FooterBranding() {
	return (
		<div className='md:col-span-2'>
			<h3 className='font-bold text-2xl mb-4 flex items-center gap-1'>
				<span className='text-secondary'>wud</span>
				<span className='text-accent'>dev</span>
				<span className='text-secondary'>det</span>
			</h3>
			<p className='text-muted-foreground max-w-xs'>
				Detroit's premier web development community hub. Connecting
				coders since 2024.
			</p>
			<div className='mt-6 flex gap-4'>
				<div className='w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center'>
					T
				</div>
				<div className='w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center'>
					G
				</div>
				<div className='w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center'>
					L
				</div>
			</div>
		</div>
	);
}
