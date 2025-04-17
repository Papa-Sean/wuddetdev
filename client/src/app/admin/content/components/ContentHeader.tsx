import { TypographyH1 } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';

interface ContentHeaderProps {
	resetFilters: () => void;
	onAddContent: () => void;
}

export function ContentHeader({
	resetFilters,
	onAddContent,
}: ContentHeaderProps) {
	return (
		<div className='mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4'>
			<div>
				<TypographyH1 className='text-3xl md:text-4xl'>
					Content Management
				</TypographyH1>
				<p className='text-muted-foreground text-sm md:text-base mt-1'>
					Manage posts, projects, comments, and other site content
				</p>
			</div>

			<div className='flex flex-wrap gap-2 md:gap-3 mt-2 md:mt-0'>
				<Button
					onClick={resetFilters}
					variant='outline'
					size='sm'
					className='flex items-center gap-1 md:size-default'
				>
					<RefreshCw
						size={14}
						className='md:size-4'
					/>
					<span className='hidden sm:inline'>Reset Filters</span>
					<span className='sm:hidden'>Reset</span>
				</Button>

				<Button
					onClick={onAddContent}
					size='sm'
					className='flex items-center gap-1 md:size-default md:gap-2'
				>
					<PlusCircle
						size={14}
						className='md:size-4'
					/>
					<span className='hidden sm:inline'>New Content</span>
					<span className='sm:hidden'>Add</span>
				</Button>
			</div>
		</div>
	);
}
