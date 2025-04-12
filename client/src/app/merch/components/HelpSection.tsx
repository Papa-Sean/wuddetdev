import Link from 'next/link';

export function HelpSection() {
	return (
		<div className='mt-12 p-6 bg-muted/30 rounded-lg text-center'>
			<h3 className='text-xl font-bold mb-2'>
				Have questions about our products?
			</h3>
			<p className='text-muted-foreground mb-4'>
				Contact us or check our sizing guide and shipping policies.
			</p>
			<div className='flex flex-wrap justify-center gap-4'>
				<Link
					href='#'
					className='text-primary font-medium hover:underline'
				>
					Sizing Guide
				</Link>
				<Link
					href='#'
					className='text-primary font-medium hover:underline'
				>
					Shipping Info
				</Link>
				<Link
					href='#'
					className='text-primary font-medium hover:underline'
				>
					Contact Support
				</Link>
			</div>
		</div>
	);
}
