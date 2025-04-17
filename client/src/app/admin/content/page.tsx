'use client';

import React, { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/guards/AdminGuard';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import {
	contentApi,
	ContentPost,
	ContentProject,
	ContentComment,
	ContentItemType,
	FilterType, // Import this type
} from '@/lib/api/content';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList, RefreshCcw } from 'lucide-react';

// Import our components
import { ContentHeader } from './components/ContentHeader';
import { SearchAndFilterBar } from './components/SearchAndFilterBar';
import { PostsTable } from './components/PostsTable';
import { ProjectsTable } from './components/ProjectsTable';
import { CommentsTable } from './components/CommentsTable'; // Fixed import path
import { ConfirmationDialog } from './components/ConfirmationDialog';

// Types
type ContentTab = 'posts' | 'projects' | 'comments' | 'all'; // Added 'all'
type ViewMode = 'table' | 'cards';

export default function ContentManagementPage() {
	// Core state
	const [posts, setPosts] = useState<ContentPost[]>([]);
	const [projects, setProjects] = useState<ContentProject[]>([]);
	const [comments, setComments] = useState<ContentComment[]>([]);
	const [activeTab, setActiveTab] = useState<ContentTab>('posts');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Count states
	const [postsCount, setPostsCount] = useState(0);
	const [projectsCount, setProjectsCount] = useState(0);
	const [commentsCount, setCommentsCount] = useState(0);

	// Filter and search state
	const [searchQuery, setSearchQuery] = useState('');
	const [filter, setFilter] = useState<FilterType>('all');

	// Selection and UI state
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [expandedItems, setExpandedItems] = useState<string[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);
	const [viewMode, setViewMode] = useState<ViewMode>('table');

	// Action states
	const [isActionLoading, setIsActionLoading] = useState(false);
	const [confirmAction, setConfirmAction] = useState<{
		type: string;
		itemId?: string;
		isOpen: boolean;
	}>({ type: '', isOpen: false });

	// Load content on tab/filter/search/page change
	useEffect(() => {
		fetchContent();
	}, [activeTab, filter, searchQuery, currentPage]);

	// Add a new useEffect for initial load and refreshes
	useEffect(() => {
		fetchContentCounts();
	}, []);

	// Fetch content
	const fetchContent = async () => {
		setIsLoading(true);
		setError(null);

		try {
			// Fetch content for the active tab
			const data = await contentApi.getContent(
				activeTab === 'all' ? undefined : activeTab,
				filter,
				searchQuery,
				currentPage,
				itemsPerPage
			);

			if (data) {
				setPosts(data.posts || []);
				setProjects(data.projects || []);
				setComments(data.comments || []);

				// Also update the counts for the current tab
				if (activeTab === 'posts') {
					setPostsCount(data.totalPosts || data.posts?.length || 0);
				} else if (activeTab === 'projects') {
					setProjectsCount(
						data.totalProjects || data.projects?.length || 0
					);
				} else if (activeTab === 'comments') {
					setCommentsCount(
						data.totalComments || data.comments?.length || 0
					);
				}
			} else {
				throw new Error('No data returned from API');
			}
		} catch (err) {
			console.error('Failed to fetch content:', err);
			setError('Failed to load content data. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	// Add this new function to fetch all counts at once
	const fetchContentCounts = async () => {
		try {
			const counts = await contentApi.getContentCounts();
			if (counts) {
				setPostsCount(counts.posts || 0);
				setProjectsCount(counts.projects || 0);
				setCommentsCount(counts.comments || 0);
			}
		} catch (err) {
			console.error('Failed to fetch content counts:', err);
		}
	};

	const refreshAllContent = async () => {
		setIsLoading(true);
		try {
			// Fetch both content and counts
			await Promise.all([fetchContent(), fetchContentCounts()]);
		} finally {
			setIsLoading(false);
		}
	};

	// Reset selections when changing tabs
	const resetSelection = () => {
		setSelectedItems([]);
		setExpandedItems([]);
		setCurrentPage(1);
	};

	// Item selection handlers
	const toggleSelectItem = (itemId: string) => {
		setSelectedItems((prev) =>
			prev.includes(itemId)
				? prev.filter((id) => id !== itemId)
				: [...prev, itemId]
		);
	};

	const toggleItemExpansion = (itemId: string) => {
		setExpandedItems((prev) =>
			prev.includes(itemId)
				? prev.filter((id) => id !== itemId)
				: [...prev, itemId]
		);
	};

	const toggleSelectAll = () => {
		let items: any[] = [];

		if (activeTab === 'posts') items = posts;
		else if (activeTab === 'projects') items = projects;
		else items = comments;

		setSelectedItems(
			selectedItems.length === items.length
				? []
				: items.map((item) => item._id || item.id)
		);
	};

	// Filter reset
	const resetFilters = () => {
		setSearchQuery('');
		setFilter('all');
		setCurrentPage(1);
	};

	// Action handler
	const handleContentAction = async (
		action: string,
		itemType: ContentItemType,
		itemId?: string
	) => {
		const itemIds = itemId ? [itemId] : selectedItems;
		if (itemIds.length === 0) return;

		if (action === 'delete' && !confirmAction.isOpen) {
			setConfirmAction({
				type: 'delete',
				itemId,
				isOpen: true,
			});
			return;
		}

		setIsActionLoading(true);

		try {
			let apiAction: 'delete' | 'pin' | 'unpin' | 'feature' | 'unfeature';

			if (action === 'delete') {
				apiAction = 'delete';
			} else if (action === 'pin') {
				apiAction = itemType === 'post' ? 'pin' : 'feature';
			} else if (action === 'unpin') {
				apiAction = itemType === 'post' ? 'unpin' : 'unfeature';
			} else {
				throw new Error(`Unsupported action: ${action}`);
			}

			await contentApi.bulkAction(apiAction, itemType, itemIds);

			// Update local state accordingly
			if (action === 'delete') {
				if (itemType === 'post') {
					setPosts((prev) =>
						prev.filter(
							(post) => !itemIds.includes(post._id || post.id)
						)
					);
				} else if (itemType === 'project') {
					setProjects((prev) =>
						prev.filter(
							(project) =>
								!itemIds.includes(project._id || project.id)
						)
					);
				} else if (itemType === 'comment') {
					setComments((prev) =>
						prev.filter(
							(comment) =>
								!itemIds.includes(comment._id || comment.id)
						)
					);
					setPosts((prev) =>
						prev.map((post) => ({
							...post,
							comments:
								post.comments?.filter(
									(comment) =>
										!itemIds.includes(
											comment._id || comment.id
										)
								) || [],
						}))
					);
				}
			} else if (action === 'pin' || action === 'unpin') {
				if (itemType === 'post') {
					setPosts((prev) =>
						prev.map((post) =>
							itemIds.includes(post._id || post.id)
								? { ...post, isPinned: action === 'pin' }
								: post
						)
					);
				} else if (itemType === 'project') {
					setProjects((prev) =>
						prev.map((project) =>
							itemIds.includes(project._id || project.id)
								? { ...project, featured: action === 'pin' }
								: project
						)
					);
				}
			}

			setSelectedItems([]);
			setConfirmAction({ type: '', isOpen: false });
		} catch (err) {
			console.error(`Failed to ${action} ${itemType}:`, err);
			setError(`Failed to ${action} ${itemType} Please try again.`);
		} finally {
			setIsActionLoading(false);
		}
	};

	// Get post title for a comment
	const getPostTitleForComment = (commentPostId: string) => {
		const post = posts.find((p) => (p._id || p.id) === commentPostId);
		return post ? post.title : 'Unknown post';
	};

	// Calculate total pages for pagination
	const getTotalPages = () => {
		let count = 0;

		if (activeTab === 'posts') count = posts.length;
		else if (activeTab === 'projects') count = projects.length;
		else count = comments.length;

		return Math.max(1, Math.ceil(count / itemsPerPage));
	};

	return (
		<AdminGuard>
			<div className='container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-full'>
				{/* Header */}
				<ContentHeader
					resetFilters={resetFilters}
					onAddContent={() => console.log('Add content clicked')}
				/>

				{/* Tabs Navigation */}
				<Tabs
					defaultValue='posts'
					value={activeTab}
					className='w-full'
				>
					{/* Search and Filter Bar */}
					<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4'>
						<SearchAndFilterBar
							activeTab={activeTab}
							setActiveTab={setActiveTab}
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
							filter={filter}
							setFilter={setFilter}
							postsCount={postsCount} // Use the dedicated count states
							projectsCount={projectsCount} // instead of array lengths
							commentsCount={commentsCount}
							resetSelection={resetSelection}
						/>

						{/* View Mode Selector & Refresh Button */}
						<div className='flex items-center gap-2 ml-auto'>
							<div className='bg-muted/30 border border-border rounded-md flex items-center'>
								<Button
									variant={
										viewMode === 'table'
											? 'secondary'
											: 'ghost'
									}
									size='sm'
									className='rounded-r-none'
									onClick={() => setViewMode('table')}
								>
									<LayoutList
										size={16}
										className='mr-1'
									/>
									<span className='hidden sm:inline'>
										Table
									</span>
								</Button>
								<Button
									variant={
										viewMode === 'cards'
											? 'secondary'
											: 'ghost'
									}
									size='sm'
									className='rounded-l-none'
									onClick={() => setViewMode('cards')}
								>
									<LayoutGrid
										size={16}
										className='mr-1'
									/>
									<span className='hidden sm:inline'>
										Cards
									</span>
								</Button>
							</div>

							<Button
								variant='outline'
								size='sm'
								onClick={refreshAllContent}
								disabled={isLoading}
								className='flex items-center gap-1'
							>
								<RefreshCcw
									size={14}
									className={isLoading ? 'animate-spin' : ''}
								/>
								<span className='hidden sm:inline'>
									Refresh
								</span>
							</Button>
						</div>
					</div>

					{/* Tab Content */}
					<TabsContent
						value={activeTab}
						className='space-y-4'
					>
						<div className='bg-card rounded-lg shadow-sm border border-border overflow-hidden'>
							<div className='w-full'>
								{/* Render the appropriate table based on activeTab */}
								{activeTab === 'posts' && (
									<PostsTable
										posts={posts}
										isLoading={isLoading}
										error={error}
										selectedItems={selectedItems}
										expandedItems={expandedItems}
										toggleSelectItem={toggleSelectItem}
										toggleItemExpansion={
											toggleItemExpansion
										}
										toggleSelectAll={toggleSelectAll}
										handleContentAction={
											handleContentAction
										}
										isActionLoading={isActionLoading}
										resetFilters={resetFilters}
										currentPage={currentPage}
										totalPages={getTotalPages()}
										setCurrentPage={setCurrentPage}
										viewMode={viewMode}
									/>
								)}

								{activeTab === 'projects' && (
									<ProjectsTable
										projects={projects}
										isLoading={isLoading}
										error={error}
										selectedItems={selectedItems}
										expandedItems={expandedItems}
										toggleSelectItem={toggleSelectItem}
										toggleItemExpansion={
											toggleItemExpansion
										}
										toggleSelectAll={toggleSelectAll}
										handleContentAction={
											handleContentAction
										}
										isActionLoading={isActionLoading}
										resetFilters={resetFilters}
										currentPage={currentPage}
										totalPages={getTotalPages()}
										setCurrentPage={setCurrentPage}
										viewMode={viewMode}
									/>
								)}

								{activeTab === 'comments' && (
									<CommentsTable
										comments={comments}
										isLoading={isLoading}
										error={error}
										selectedItems={selectedItems}
										expandedItems={expandedItems}
										toggleSelectItem={toggleSelectItem}
										toggleItemExpansion={
											toggleItemExpansion
										}
										toggleSelectAll={toggleSelectAll}
										handleContentAction={
											handleContentAction
										}
										isActionLoading={isActionLoading}
										resetFilters={resetFilters}
										currentPage={currentPage}
										totalPages={getTotalPages()}
										setCurrentPage={setCurrentPage}
										getPostTitleForComment={
											getPostTitleForComment
										}
										viewMode={viewMode}
									/>
								)}
							</div>
						</div>
					</TabsContent>
				</Tabs>

				{/* Confirmation Dialog */}
				<ConfirmationDialog
					isOpen={confirmAction.isOpen}
					title='Confirm Action'
					message={
						confirmAction.type === 'delete'
							? `Are you sure you want to delete ${
									confirmAction.itemId
										? 'this'
										: 'the selected'
							  } content? This action cannot be undone.`
							: 'Are you sure you want to perform this action?'
					}
					confirmLabel='Confirm'
					isDestructive={confirmAction.type === 'delete'}
					isLoading={isActionLoading}
					onConfirm={() => {
						if (activeTab === 'posts') {
							handleContentAction(
								confirmAction.type,
								'post',
								confirmAction.itemId
							);
						} else if (activeTab === 'projects') {
							handleContentAction(
								confirmAction.type,
								'project',
								confirmAction.itemId
							);
						} else {
							handleContentAction(
								confirmAction.type,
								'comment',
								confirmAction.itemId
							);
						}
					}}
					onCancel={() =>
						setConfirmAction({ type: '', isOpen: false })
					}
				/>
			</div>
		</AdminGuard>
	);
}
