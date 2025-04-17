import { Button } from '@/components/ui/button';

interface ConfirmationDialogProps {
	isOpen: boolean;
	title: string;
	message: string;
	confirmLabel: string;
	isDestructive: boolean;
	isLoading: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export function ConfirmationDialog({
	isOpen,
	title,
	message,
	confirmLabel,
	isDestructive,
	isLoading,
	onConfirm,
	onCancel,
}: ConfirmationDialogProps) {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50'>
			<div className='bg-card p-6 rounded-lg shadow-lg max-w-md w-full'>
				<h3 className='text-lg font-bold mb-2'>{title}</h3>
				<p className='mb-4'>{message}</p>
				<div className='flex justify-end gap-2'>
					<Button
						variant='outline'
						onClick={onCancel}
						disabled={isLoading}
					>
						Cancel
					</Button>
					<Button
						variant={isDestructive ? 'destructive' : 'default'}
						onClick={onConfirm}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<div className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2'></div>
								Processing...
							</>
						) : (
							confirmLabel
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
