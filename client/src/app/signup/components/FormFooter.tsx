import React from 'react';
import Link from 'next/link';

export function FormFooter() {
	return (
		<div className='mt-6 text-center'>
			<p className='text-muted-foreground'>
				Already have an account?{' '}
				<Link
					href='/login'
					className='text-primary hover:underline font-medium'
				>
					Sign In
				</Link>
			</p>
		</div>
	);
}
