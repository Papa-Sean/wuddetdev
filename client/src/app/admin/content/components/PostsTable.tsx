import React from 'react';
import { ContentPost } from '@/lib/api/content';
import { format } from 'date-fns';
import {
	Pin,
	Trash2,
	ChevronUp,
	ChevronDown,
	Pencil,
	MoreHorizontal,
	Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ContentPagination } from './ContentPagination';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

interface PostsTableProps {
	posts: ContentPost[];
	isLoading: boolean;
	error: string | null;
	selectedItems: string[];
	expandedItems: string[];
	toggleSelectItem: (id: string) => void;
	toggleItemExpansion: (id: string) => void;
	toggleSelectAll: () => void;
	handleContentAction: (
		action: string,
		itemType: 'post',
		itemId?: string
	) => void;
	isActionLoading: boolean;
	resetFilters: () => void;
	currentPage: number;
	totalPages: number;
	setCurrentPage: (page: number) => void;
	viewMode: 'table' | 'cards';
}

export function PostsTable({
	posts,
	isLoading,
	error,
	selectedItems,
	expandedItems,
	toggleSelectItem,
	toggleItemExpansion,
	toggleSelectAll,
	handleContentAction,
	isActionLoading,
	resetFilters,
	currentPage,
	totalPages,
	setCurrentPage,
	viewMode,
}: PostsTableProps) {
	const formatDate = (dateString: string) => {
		try {
			return format(new Date(dateString), 'MMM d, yyyy');
		} catch (e) {
			return 'Invalid date';
		}
	};

	const truncateText = (text: string, maxLength: number) => {
		if (!text) return '';
		return text.length > maxLength
			? text.substring(0, maxLength) + '...'
			: text;
	};

	if (isLoading) return <LoadingState />;
	if (error)
		return (
			<ErrorState
				message={error}
				onRetry={resetFilters}
			/>
		);
	if (posts.length === 0) {
		return (
			<EmptyState
				message='No posts match your filters'
				resetFilters={resetFilters}
			/>
		);
	}

	// Render expanded post content
	const renderExpandedPostContent = (post: ContentPost) => (
		<div className='w-full space-y-4'>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 w-full'>
				<div className='w-full min-w-0'>
					<h4 className='font-medium text-sm mb-2'>Content</h4>
					<div className='bg-muted/20 p-3 rounded-md overflow-hidden'>
						<p className='text-sm break-words whitespace-pre-wrap max-h-40 overflow-y-auto'>
							{post.content}
						</p>
					</div>
				</div>

				<div className='w-full min-w-0'>
					<h4 className='font-medium text-sm mb-2'>Details</h4>
					<div className='space-y-2 text-sm'>
						{post.eventDate && (
							<div className='flex flex-wrap justify-between gap-x-2'>
								<span className='text-muted-foreground'>
									Event Date:
								</span>
								<span>{formatDate(post.eventDate)}</span>
							</div>
						)}
						{post.location && (
							<div className='flex flex-wrap justify-between gap-x-2'>
								<span className='text-muted-foreground'>
									Location:
								</span>
								<span className='text-right'>
									{post.location}
								</span>
							</div>
						)}
						<div className='flex flex-wrap justify-between gap-x-2'>
							<span className='text-muted-foreground'>
								Created:
							</span>
							<span>{formatDate(post.createdAt)}</span>
						</div>
						<div className='flex flex-wrap justify-between gap-x-2'>
							<span className='text-muted-foreground'>ID:</span>
							<span className='font-mono text-xs max-w-full overflow-hidden text-ellipsis'>
								{post._id || post.id}
							</span>
						</div>
					</div>

					<div className='mt-4 flex flex-wrap gap-2'>
						<Button
							size='sm'
							variant='outline'
							className='flex-1 min-w-[100px]'
						>
							<Pencil
								size={14}
								className='mr-1 flex-shrink-0'
							/>
							<span className='truncate'>Edit</span>
						</Button>
						<Button
							size='sm'
							variant='outline'
							className='flex-1 min-w-[100px] text-red-600 border-red-200 hover:bg-red-50'
							onClick={() =>
								handleContentAction(
									'delete',
									'post',
									post._id || post.id
								)
							}
							disabled={isActionLoading}
						>
							<Trash2
								size={14}
								className='mr-1 flex-shrink-0'
							/>
							<span className='truncate'>Delete</span>
						</Button>
					</div>
				</div>
			</div>

			{/* Comments Section - Improved for responsiveness */}
			{post.comments && post.comments.length > 0 && (
				<div className='w-full'>
					<h4 className='font-medium text-sm mb-2'>
						Comments ({post.comments.length})
					</h4>
					<div className='space-y-2 max-h-60 overflow-y-auto'>
						{post.comments.map((comment) => (
							<div
								key={comment._id || comment.id}
								className='bg-muted/20 p-3 rounded-md text-sm'
							>
								<div className='flex flex-wrap justify-between gap-x-2 mb-1'>
									<span className='font-medium'>
										{comment.author?.name || 'Unknown'}
									</span>
									<span className='text-xs text-muted-foreground'>
										{formatDate(comment.createdAt)}
									</span>
								</div>
								<p className='break-words whitespace-pre-wrap'>
									{comment.content}
								</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);

	return (
		<>
			{/* Bulk Actions Bar */}
			{selectedItems.length > 0 && (
				<div className='bg-muted/30 border-b border-border p-3 flex flex-wrap items-center justify-between gap-2'>
					<span className='text-sm'>
						{selectedItems.length} item(s) selected
					</span>
					<div className='flex flex-wrap gap-2'>
						<Button
							size='sm'
							variant='outline'
							onClick={() => handleContentAction('pin', 'post')}
							disabled={isActionLoading}
						>
							<Pin
								size={14}
								className='mr-1'
							/>
							Pin
						</Button>
						<Button
							size='sm'
							variant='outline'
							onClick={() => handleContentAction('unpin', 'post')}
							disabled={isActionLoading}
						>
							<Pin
								size={14}
								className='mr-1'
							/>
							Unpin
						</Button>
						<Button
							size='sm'
							variant='outline'
							className='text-red-600 border-red-200 hover:bg-red-50'
							onClick={() =>
								handleContentAction('delete', 'post')
							}
							disabled={isActionLoading}
						>
							<Trash2
								size={14}
								className='mr-1'
							/>
							Delete
						</Button>
					</div>
				</div>
			)}

			{/* Table View */}
			{viewMode === 'table' && (
				<div className='hidden md:block w-full'>
					<div className='w-full overflow-x-auto'>
						<table className='w-full table-fixed'>
							<thead className='bg-muted/50 text-left'>
								<tr>
									<th className='px-6 py-3 w-8'>
										<input
											type='checkbox'
											checked={
												selectedItems.length ===
													posts.length &&
												posts.length > 0
											}
											onChange={toggleSelectAll}
											className='w-4 h-4 rounded border-gray-300'
										/>
									</th>
									<th className='px-6 py-3 font-medium w-[30%]'>
										Title
									</th>
									<th className='px-6 py-3 font-medium w-[15%]'>
										Author
									</th>
									<th className='px-6 py-3 font-medium w-[15%]'>
										Date
									</th>
									<th className='px-6 py-3 font-medium w-[8%]'>
										Comments
									</th>
									<th className='px-6 py-3 font-medium w-[12%]'>
										Status
									</th>
									<th className='px-6 py-3 font-medium w-[10%]'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-border'>
								{posts.map((post) => {
									const postId = post._id || post.id;
									const isExpanded =
										expandedItems.includes(postId);

									return (
										<React.Fragment key={postId}>
											<tr
												className={cn(
													'hover:bg-muted/30 transition-colors',
													isExpanded && 'bg-muted/20'
												)}
											>
												<td className='px-6 py-4'>
													<input
														type='checkbox'
														checked={selectedItems.includes(
															postId
														)}
														onChange={() =>
															toggleSelectItem(
																postId
															)
														}
														onClick={(e) =>
															e.stopPropagation()
														}
														className='w-4 h-4 rounded border-gray-300'
													/>
												</td>
												<td
													className='px-6 py-4 cursor-pointer'
													onClick={() =>
														toggleItemExpansion(
															postId
														)
													}
												>
													<div className='font-medium flex items-center'>
														{post.isPinned && (
															<Pin
																size={14}
																className='text-primary mr-2'
															/>
														)}
														{truncateText(
															post.title,
															50
														)}
													</div>
												</td>
												<td className='px-6 py-4 text-sm text-muted-foreground'>
													{post.author?.name ||
														'Unknown'}
												</td>
												<td className='px-6 py-4 text-sm whitespace-nowrap'>
													{formatDate(post.createdAt)}
												</td>
												<td className='px-6 py-4 text-sm'>
													{post.comments?.length || 0}
												</td>
												<td className='px-6 py-4'>
													<span
														className={cn(
															'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
															post.isPinned
																? 'bg-primary/10 text-primary'
																: 'bg-muted text-muted-foreground'
														)}
													>
														{post.isPinned
															? 'Pinned'
															: 'Published'}
													</span>
												</td>
												<td className='px-6 py-4'>
													<div className='flex items-center'>
														<Button
															variant='ghost'
															size='icon'
															onClick={() =>
																toggleItemExpansion(
																	postId
																)
															}
															className='h-8 w-8'
														>
															{isExpanded ? (
																<ChevronUp
																	size={16}
																/>
															) : (
																<ChevronDown
																	size={16}
																/>
															)}
														</Button>
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8'
														>
															<MoreHorizontal
																size={16}
															/>
														</Button>
													</div>
												</td>
											</tr>

											{/* Expanded Row Content */}
											{isExpanded && (
												<tr className='bg-muted/10'>
													<td
														colSpan={7}
														className='px-2 sm:px-4 md:px-6 py-4 w-full'
													>
														<div className='animate-in fade-in-0 slide-in-from-top-1 duration-200 w-full'>
															{renderExpandedPostContent(
																post
															)}
														</div>
													</td>
												</tr>
											)}
										</React.Fragment>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Card View or Mobile View */}
			<div
				className={viewMode === 'table' ? 'md:hidden w-full' : 'w-full'}
			>
				<div className='p-2 sm:p-4 space-y-4 w-full'>
					{posts.map((post) => {
						const postId = post._id || post.id;
						const isExpanded = expandedItems.includes(postId);

						return (
							<div
								key={postId}
								className='border border-border rounded-lg overflow-hidden bg-card'
							>
								<div
									className='p-4 flex justify-between cursor-pointer'
									onClick={() => toggleItemExpansion(postId)}
								>
									<div className='flex-1'>
										<div className='flex items-center gap-2 mb-2'>
											<input
												type='checkbox'
												checked={selectedItems.includes(
													postId
												)}
												onChange={(e) => {
													e.stopPropagation();
													toggleSelectItem(postId);
												}}
												className='w-4 h-4 rounded border-gray-300'
											/>
											<h3 className='font-medium flex items-center'>
												{post.isPinned && (
													<Pin
														size={14}
														className='text-primary mr-1'
													/>
												)}
												{truncateText(post.title, 40)}
											</h3>
										</div>

										<div className='text-sm text-muted-foreground mb-1'>
											By {post.author?.name || 'Unknown'}{' '}
											· {formatDate(post.createdAt)}
										</div>

										<div className='text-xs'>
											{post.comments?.length || 0}{' '}
											comments
										</div>
									</div>

									<div className='flex items-center'>
										{isExpanded ? (
											<ChevronUp size={16} />
										) : (
											<ChevronDown size={16} />
										)}
									</div>
								</div>

								{/* Expanded Card Content */}
								{isExpanded && (
									<div className='border-t border-border bg-muted/10 animate-in fade-in-0 slide-in-from-top-1 duration-200'>
										<div className='p-2 sm:p-4 w-full overflow-hidden'>
											{renderExpandedPostContent(post)}
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>

			{/* Pagination */}
			<ContentPagination
				currentPage={currentPage}
				totalPages={totalPages}
				itemsShowing={posts.length}
				totalItems={posts.length}
				itemType='posts'
				onPageChange={setCurrentPage}
			/>
		</>
	);
}
