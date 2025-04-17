import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export interface ErrorStateProps {
	message: string;
	onRetry?: () => void; // Make this prop optional with a question mark
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
	return (
		<div className='p-8 text-center'>
			<AlertTriangle className='w-12 h-12 mx-auto mb-4 text-red-500' />
			<p className='text-lg font-medium text-red-500'>{message}</p>
			{onRetry && (
				<Button
					onClick={onRetry}
					variant='outline'
					className='mt-4'
				>
					Try Again
				</Button>
			)}
		</div>
	);
}
