import { Button } from '@/components/ui/button';

interface ContentPaginationProps {
	currentPage: number;
	totalPages: number;
	itemsShowing: number;
	totalItems: number;
	itemType: string;
	onPageChange: (page: number) => void;
}

export function ContentPagination({
	currentPage,
	totalPages,
	itemsShowing,
	totalItems,
	itemType,
	onPageChange,
}: ContentPaginationProps) {
	return (
		<div className='px-6 py-4 border-t border-border flex justify-between items-center'>
			<span className='text-sm text-muted-foreground'>
				Showing {itemsShowing} of {totalItems} {itemType}
			</span>
			<div className='flex gap-2'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					Previous
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
