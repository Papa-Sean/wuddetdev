import { Button } from '@/components/ui/button';

interface BulkActionDialogProps {
	isOpen: boolean;
	actionType: string | null;
	userCount: number;
	isLoading: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export function BulkActionDialog({
	isOpen,
	actionType,
	userCount,
	isLoading,
	onConfirm,
	onCancel,
}: BulkActionDialogProps) {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50'>
			<div className='bg-card p-6 rounded-lg shadow-lg max-w-md w-full'>
				<h3 className='text-lg font-bold mb-2'>Confirm Action</h3>
				<p className='mb-4'>
					Are you sure you want to {actionType} {userCount}{' '}
					{userCount === 1 ? 'user' : 'users'}?
				</p>
				<div className='flex justify-end gap-2'>
					<Button
						variant='outline'
						onClick={onCancel}
						disabled={isLoading}
					>
						Cancel
					</Button>
					<Button
						variant={
							actionType === 'delete' ? 'destructive' : 'default'
						}
						onClick={onConfirm}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<div className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2'></div>
								Processing...
							</>
						) : (
							'Confirm'
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
