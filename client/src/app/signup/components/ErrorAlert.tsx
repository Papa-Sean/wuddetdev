import React from 'react';

interface ErrorAlertProps {
	message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
	if (!message) return null;

	return (
		<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6'>
			{message}
		</div>
	);
}
