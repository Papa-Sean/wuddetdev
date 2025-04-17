import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
	message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
	return (
		<div className='p-8 text-center'>
			<AlertTriangle className='w-12 h-12 mx-auto mb-4 text-red-500' />
			<p className='text-lg font-medium text-red-500'>{message}</p>
			<Button
				onClick={() => window.location.reload()}
				variant='outline'
				className='mt-4'
			>
				Try Again
			</Button>
		</div>
	);
}
