import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TableColumn {
	key: string;
	title: string;
	className?: string;
	render?: (value: any, item: any, index: number) => ReactNode;
	hideOnMobile?: boolean;
}

export interface TableRowProps {
	item: any;
	columns: TableColumn[];
	isSelected?: boolean;
	isExpanded?: boolean;
	onToggleSelect?: (e: React.MouseEvent) => void;
	onToggleExpand?: () => void;
	expandedContent?: ReactNode;
	className?: string;
}

export function TableRow({
	item,
	columns,
	isSelected = false,
	isExpanded = false,
	onToggleSelect,
	onToggleExpand,
	expandedContent,
	className,
}: TableRowProps) {
	// Get ID from MongoDB _id or regular id
	const itemId = item._id || item.id;

	return (
		<div className='w-full'>
			{/* Main row */}
			<div
				className={cn(
					'border-b border-border transition-colors',
					isExpanded ? 'bg-muted/20' : 'hover:bg-muted/30',
					className
				)}
			>
				<div
					className='flex items-center p-4 cursor-pointer'
					onClick={onToggleExpand}
				>
					{onToggleSelect && (
						<div
							className='pr-4 flex-shrink-0'
							onClick={(e) => {
								e.stopPropagation();
								onToggleSelect(e);
							}}
						>
							<input
								type='checkbox'
								checked={isSelected}
								onChange={() => {}}
								className='w-4 h-4 rounded border-gray-300'
							/>
						</div>
					)}

					<div className='flex-1 grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-4'>
						{columns.map((column, index) => {
							// Handle nested properties like author.name
							let value = item[column.key];
							if (column.key.includes('.')) {
								const parts = column.key.split('.');
								let nestedValue = item;
								for (const part of parts) {
									nestedValue = nestedValue?.[part];
									if (nestedValue === undefined) break;
								}
								value = nestedValue;
							}

							// Skip columns marked to hide on mobile when in mobile view
							if (
								column.hideOnMobile &&
								typeof window !== 'undefined' &&
								window.innerWidth < 768
							) {
								return null;
							}

							return (
								<div
									key={column.key}
									className={cn(
										'truncate',
										index === 0 &&
											'font-medium md:col-span-2',
										column.className
									)}
								>
									{column.render
										? column.render(value, item, index)
										: value}
								</div>
							);
						})}
					</div>

					{onToggleExpand && (
						<div className='ml-2 flex-shrink-0'>
							{isExpanded ? (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='20'
									height='20'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='text-muted-foreground'
								>
									<path d='m18 15-6-6-6 6' />
								</svg>
							) : (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='20'
									height='20'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='text-muted-foreground'
								>
									<path d='m6 9 6 6 6-6' />
								</svg>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Expanded content - shown conditionally with animation */}
			{isExpanded && expandedContent && (
				<div className='border-b border-border bg-muted/10 overflow-hidden animate-in fade-in-0 slide-in-from-top-1 duration-200'>
					<div className='p-4'>{expandedContent}</div>
				</div>
			)}
		</div>
	);
}
