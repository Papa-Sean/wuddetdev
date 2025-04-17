import React from 'react';
import { ContentComment } from '@/lib/api/content';
import { format } from 'date-fns';
import {
	Trash2,
	ChevronUp,
	ChevronDown,
	FileText,
	User,
	ExternalLink,
	MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ContentPagination } from './ContentPagination';
import { LoadingState } from './ui/LoadingState';
import { ErrorState } from './ui/ErrorState';
import { EmptyState } from './ui/EmptyState';
import { cn } from '@/lib/utils';

interface CommentsTableProps {
	comments: ContentComment[];
	isLoading: boolean;
	error: string | null;
	selectedItems: string[];
	expandedItems: string[];
	toggleSelectItem: (id: string) => void;
	toggleItemExpansion: (id: string) => void;
	toggleSelectAll: () => void;
	handleContentAction: (
		action: string,
		itemType: 'comment',
		itemId?: string
	) => void;
	isActionLoading: boolean;
	resetFilters: () => void;
	currentPage: number;
	totalPages: number;
	setCurrentPage: (page: number) => void;
	getPostTitleForComment: (postId: string) => string;
	viewMode: 'table' | 'cards';
}

export function CommentsTable({
	comments,
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
	getPostTitleForComment,
	viewMode,
}: CommentsTableProps) {
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
	if (comments.length === 0) {
		return (
			<EmptyState
				message='No comments match your filters'
				resetFilters={resetFilters}
			/>
		);
	}

	// Render expanded comment content
	const renderExpandedCommentContent = (comment: ContentComment) => (
		<div className='w-full space-y-4'>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 w-full'>
				<div className='w-full min-w-0'>
					<h4 className='font-medium text-sm mb-2'>
						Comment Content
					</h4>
					<div className='bg-muted/20 p-3 rounded-md overflow-hidden'>
						<p className='text-sm break-words whitespace-pre-wrap max-h-40 overflow-y-auto'>
							{comment.content}
						</p>
					</div>
				</div>

				<div className='w-full min-w-0'>
					<h4 className='font-medium text-sm mb-2'>Details</h4>
					<div className='space-y-2 text-sm'>
						<div className='flex flex-wrap justify-between gap-x-2'>
							<span className='text-muted-foreground'>Post:</span>
							<span className='text-primary font-medium'>
								{getPostTitleForComment(comment.postId)}
							</span>
						</div>
						<div className='flex flex-wrap justify-between gap-x-2'>
							<span className='text-muted-foreground'>
								Author:
							</span>
							<span>{comment.author?.name || 'Unknown'}</span>
						</div>
						<div className='flex flex-wrap justify-between gap-x-2'>
							<span className='text-muted-foreground'>
								Created:
							</span>
							<span>{formatDate(comment.createdAt)}</span>
						</div>
						<div className='flex flex-wrap justify-between gap-x-2'>
							<span className='text-muted-foreground'>ID:</span>
							<span className='font-mono text-xs max-w-full overflow-hidden text-ellipsis'>
								{comment._id || comment.id}
							</span>
						</div>
					</div>

					<div className='mt-4 flex flex-wrap gap-2'>
						<Button
							size='sm'
							variant='outline'
							className='flex-1 min-w-[100px] text-red-600 border-red-200 hover:bg-red-50'
							onClick={() =>
								handleContentAction(
									'delete',
									'comment',
									comment._id || comment.id
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
						<Button
							size='sm'
							variant='outline'
							className='flex-1 min-w-[100px]'
							onClick={() =>
								window.open(
									`/say-what-up-doe?post=${comment.postId}`,
									'_blank'
								)
							}
						>
							<ExternalLink
								size={14}
								className='mr-1 flex-shrink-0'
							/>
							<span className='truncate'>View In Post</span>
						</Button>
					</div>
				</div>
			</div>
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
							className='text-red-600 border-red-200 hover:bg-red-50'
							onClick={() =>
								handleContentAction('delete', 'comment')
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
													comments.length &&
												comments.length > 0
											}
											onChange={toggleSelectAll}
											className='w-4 h-4 rounded border-gray-300'
										/>
									</th>
									<th className='px-6 py-3 font-medium w-[40%]'>
										Comment
									</th>
									<th className='px-6 py-3 font-medium w-[15%]'>
										Author
									</th>
									<th className='px-6 py-3 font-medium w-[20%]'>
										Post
									</th>
									<th className='px-6 py-3 font-medium w-[15%]'>
										Date
									</th>
									<th className='px-6 py-3 font-medium w-[10%]'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-border'>
								{comments.map((comment) => {
									const commentId = comment._id || comment.id;
									const isExpanded =
										expandedItems.includes(commentId);

									return (
										<React.Fragment key={commentId}>
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
															commentId
														)}
														onChange={() =>
															toggleSelectItem(
																commentId
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
															commentId
														)
													}
												>
													<p
														className='text-sm truncate'
														title={comment.content}
													>
														{truncateText(
															comment.content,
															70
														)}
													</p>
												</td>
												<td className='px-6 py-4 text-sm truncate'>
													<div className='flex items-center gap-2'>
														<Avatar className='h-6 w-6'>
															<AvatarFallback>
																{comment.author?.name?.charAt(
																	0
																) || 'U'}
															</AvatarFallback>
															{comment.author
																?.profilePic && (
																<AvatarImage
																	src={
																		comment
																			.author
																			.profilePic
																	}
																	alt={
																		comment
																			.author
																			.name
																	}
																/>
															)}
														</Avatar>
														<span className='text-muted-foreground'>
															{comment.author
																?.name ||
																'Unknown'}
														</span>
													</div>
												</td>
												<td className='px-6 py-4 text-sm'>
													<span
														className='text-primary truncate'
														title={getPostTitleForComment(
															comment.postId
														)}
													>
														{truncateText(
															getPostTitleForComment(
																comment.postId
															),
															30
														)}
													</span>
												</td>
												<td className='px-6 py-4 text-sm whitespace-nowrap'>
													{formatDate(
														comment.createdAt
													)}
												</td>
												<td className='px-6 py-4'>
													<div className='flex items-center'>
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8'
															onClick={() =>
																toggleItemExpansion(
																	commentId
																)
															}
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
														colSpan={6}
														className='px-2 sm:px-4 md:px-6 py-4 w-full'
													>
														<div className='animate-in fade-in-0 slide-in-from-top-1 duration-200 w-full'>
															{renderExpandedCommentContent(
																comment
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
					{comments.map((comment) => {
						const commentId = comment._id || comment.id;
						const isExpanded = expandedItems.includes(commentId);

						return (
							<div
								key={commentId}
								className='border border-border rounded-lg overflow-hidden bg-card'
							>
								<div
									className='p-4 flex justify-between cursor-pointer'
									onClick={() =>
										toggleItemExpansion(commentId)
									}
								>
									<div className='flex-1 min-w-0'>
										<div className='flex items-center gap-2 mb-2'>
											<input
												type='checkbox'
												checked={selectedItems.includes(
													commentId
												)}
												onChange={(e) => {
													e.stopPropagation();
													toggleSelectItem(commentId);
												}}
												className='w-4 h-4 rounded border-gray-300'
											/>
											<div className='flex items-center gap-2'>
												<Avatar className='h-6 w-6'>
													<AvatarFallback>
														{comment.author?.name?.charAt(
															0
														) || 'U'}
													</AvatarFallback>
													{comment.author
														?.profilePic && (
														<AvatarImage
															src={
																comment.author
																	.profilePic
															}
															alt={
																comment.author
																	.name
															}
														/>
													)}
												</Avatar>
												<span className='font-medium truncate'>
													{comment.author?.name ||
														'Unknown'}
												</span>
											</div>
										</div>

										<p className='text-sm mb-2 line-clamp-2'>
											{comment.content}
										</p>

										<div className='text-xs text-muted-foreground mb-1 flex justify-between'>
											<span>
												On:{' '}
												<span className='text-primary'>
													{truncateText(
														getPostTitleForComment(
															comment.postId
														),
														20
													)}
												</span>
											</span>
											<span>
												{formatDate(comment.createdAt)}
											</span>
										</div>
									</div>

									<div className='flex items-center ml-3 flex-shrink-0'>
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
											{renderExpandedCommentContent(
												comment
											)}
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
				itemsShowing={comments.length}
				totalItems={comments.length}
				itemType='comments'
				onPageChange={setCurrentPage}
			/>
		</>
	);
}
