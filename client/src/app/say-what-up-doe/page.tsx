'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { PageHeader } from './components/PageHeader';
import { GuestForm } from './components/GuestView/GuestForm';
import { AuthenticatedView } from './components/AuthenticatedView/AuthenticatedView';
import { postsApi } from '@/lib/api/posts';
import { contactApi } from '@/lib/api/contact';
import {
	Post,
	GuestMessage,
	GuestFormData,
	PostFormData,
} from './components/types';
import { cn } from '@/lib/utils';

export default function SayWhatUpDoePage() {
	// Protection - will redirect to login if not authenticated
	const { isLoading: isRouteLoading } = useProtectedRoute({
		requiredRole: undefined,
	});

	// Get auth state from context
	const { user, isAuthenticated, isLoading: authLoading } = useAuth();
	const isAdmin = user?.role === 'admin';

	// Data state
	const [posts, setPosts] = useState<Post[]>([]);
	const [guestMessages, setGuestMessages] = useState<GuestMessage[]>([]);
	const [isDataLoading, setIsDataLoading] = useState(true);
	const [error, setError] = useState('');

	// UI state
	const [activeTab, setActiveTab] = useState('posts');
	const [showNewPostForm, setShowNewPostForm] = useState(false);
	const [activeCommentPostId, setActiveCommentPostId] = useState<
		string | null
	>(null);
	const [pageTheme, setPageTheme] = useState<
		'primary' | 'secondary' | 'accent'
	>('primary');

	// Form state
	const [newPostForm, setNewPostForm] = useState<PostFormData>({
		title: '',
		content: '',
		eventDate: '',
		location: '',
	});
	const [newComment, setNewComment] = useState('');
	const [guestForm, setGuestForm] = useState<GuestFormData>({
		name: '',
		email: '',
		message: '',
	});

	// Fetch MongoDB data
	useEffect(() => {
		async function fetchData() {
			if (!isAuthenticated || authLoading || isRouteLoading) return;

			setIsDataLoading(true);
			setError('');

			try {
				// Load posts
				const postsData = await postsApi.getPosts();
				setPosts(postsData.posts);

				// If admin, also load guest messages
				if (isAdmin) {
					const messagesData = await contactApi.getGuestMessages();
					setGuestMessages(messagesData);
				}
			} catch (err) {
				console.error('Error fetching data:', err);
				setError('Failed to load data. Please try again later.');
			} finally {
				setIsDataLoading(false);
			}
		}

		fetchData();
	}, [isAuthenticated, authLoading, isRouteLoading, isAdmin]);

	// Event handlers
	const handleGuestFormChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setGuestForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleGuestFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Reset form after submission (the actual submission is handled in the GuestForm component)
		setGuestForm({
			name: '',
			email: '',
			message: '',
		});
	};

	const handleNewPostFormChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setNewPostForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleNewPostSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const newPost = await postsApi.createPost(newPostForm);

			// Ensure the post has a consistent ID property
			const normalizedPost = {
				...newPost,
				id: newPost.id || newPost._id,
				author: {
					...newPost.author,
					id: newPost.author.id || newPost.author._id,
				},
			};

			setPosts((prev) => [normalizedPost, ...prev]);
			setNewPostForm({
				title: '',
				content: '',
				eventDate: '',
				location: '',
			});
			setShowNewPostForm(false);
		} catch (err) {
			console.error('Error creating post:', err);
			// Display error to user
		}
	};

	// Comment functions
	const handleCommentSubmit = async (postId: string) => {
		if (!newComment.trim()) return;

		try {
			const addedComment = await postsApi.addComment(postId, newComment);

			// Update the posts with the new comment
			setPosts((prev) =>
				prev.map((post) =>
					post.id === postId || post._id === postId
						? {
								...post,
								comments: [...post.comments, addedComment],
						  }
						: post
				)
			);

			setNewComment('');
			setActiveCommentPostId(null);
		} catch (err) {
			console.error('Error adding comment:', err);
			// Display error to user
		}
	};

	// Add this new function to delete comments
	const deleteComment = async (postId: string, commentId: string) => {
		try {
			await postsApi.deleteComment(postId, commentId);

			// Update the UI by removing the comment
			setPosts((prev) =>
				prev.map((post) =>
					post.id === postId || post._id === postId
						? {
								...post,
								comments: post.comments.filter(
									(comment) =>
										comment.id !== commentId &&
										comment._id !== commentId
								),
						  }
						: post
				)
			);
		} catch (err) {
			console.error('Error deleting comment:', err);
			// Display error to user
		}
	};

	const togglePinPost = async (postId: string) => {
		try {
			const result = await postsApi.togglePin(postId);

			setPosts((prev) =>
				prev.map((post) =>
					post.id === postId
						? { ...post, isPinned: result.isPinned }
						: post
				)
			);
		} catch (err) {
			console.error('Error toggling pin:', err);
			// Display error to user
		}
	};

	const deletePost = async (postId: string) => {
		if (!confirm('Are you sure you want to delete this post?')) return;

		try {
			await postsApi.deletePost(postId);
			setPosts((prev) => prev.filter((post) => post.id !== postId));
		} catch (err) {
			console.error('Error deleting post:', err);
			// Display error to user
		}
	};

	const toggleResponseStatus = async (messageId: string) => {
		try {
			const updatedMessage = await contactApi.toggleResponseStatus(
				messageId
			);

			setGuestMessages((prev) =>
				prev.map((msg) => (msg.id === messageId ? updatedMessage : msg))
			);
		} catch (err) {
			console.error('Error toggling response status:', err);
			// Display error to user
		}
	};

	// Show loading state
	const isLoading =
		isRouteLoading || authLoading || !isAuthenticated || isDataLoading;

	if (isLoading) {
		return (
			<div className='h-screen flex items-center justify-center'>
				<div className='animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full'></div>
			</div>
		);
	}

	// Show error state
	if (error) {
		return (
			<div className='container mx-auto px-4 py-8'>
				<div className='bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6'>
					<p>{error}</p>
					<button
						className='mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded'
						onClick={() => window.location.reload()}
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<div
			className={cn(
				'min-h-screen transition-all duration-500',
				pageTheme === 'primary' && 'bg-primary/5',
				pageTheme === 'secondary' && 'bg-secondary/5',
				pageTheme === 'accent' && 'bg-accent/5'
			)}
		>
			<div className='container mx-auto px-4 py-8 relative z-10'>
				<PageHeader
					isLoggedIn={isAuthenticated}
					isAdmin={isAdmin}
					toggleLogin={() => {}}
					toggleAdmin={() => {}}
					theme={pageTheme}
				/>

				{isAuthenticated ? (
					<AuthenticatedView
						isAdmin={isAdmin}
						posts={posts}
						guestMessages={guestMessages}
						activeTab={activeTab}
						showNewPostForm={showNewPostForm}
						newPostForm={newPostForm}
						activeCommentPostId={activeCommentPostId}
						newComment={newComment}
						setActiveTab={setActiveTab}
						setNewPostForm={setNewPostForm}
						setShowNewPostForm={setShowNewPostForm}
						setNewComment={setNewComment}
						setActiveCommentPostId={setActiveCommentPostId}
						handleNewPostFormChange={handleNewPostFormChange}
						handleNewPostSubmit={handleNewPostSubmit}
						handleCommentSubmit={handleCommentSubmit}
						togglePinPost={togglePinPost}
						deletePost={deletePost}
						toggleResponseStatus={toggleResponseStatus}
						theme={pageTheme}
					/>
				) : (
					<GuestForm
						formData={guestForm}
						onChange={handleGuestFormChange}
						onSubmit={handleGuestFormSubmit}
						theme={pageTheme}
					/>
				)}
			</div>
		</div>
	);
}
