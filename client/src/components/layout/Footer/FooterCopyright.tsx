export function FooterCopyright() {
	return (
		<div className='mt-16 pt-6 border-t border-primary/20 text-center text-secondary'>
			<div className='inline-block px-4 py-2 bg-primary/10 rounded-full text-xs'>
				&copy; {new Date().getFullYear()} wuddevdet. All rights
				reserved.
			</div>
		</div>
	);
}
