import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Pin, Trash2 } from 'lucide-react';
import { Post } from '../../types';
import { CommentSection } from './CommentSection';
import { useAuth } from '@/context/AuthContext';

interface PostCardProps {
	post: Post;
	isAdmin: boolean;
	activeCommentPostId: string | null;
	newComment: string;
	setNewComment: (comment: string) => void;
	setActiveCommentPostId: (id: string | null) => void;
	onCommentSubmit: (postId: string) => void;
	onTogglePin: (postId: string) => void;
	onDelete: (postId: string) => void;
	onDeleteComment: (postId: string, commentId: string) => void;
}

export function PostCard({
	post,
	isAdmin,
	activeCommentPostId,
	newComment,
	setNewComment,
	setActiveCommentPostId,
	onCommentSubmit,
	onTogglePin,
	onDelete,
	onDeleteComment,
}: PostCardProps) {
	// Get current user to check ownership
	const { user } = useAuth();

	// Fix: Ensure postId is always a string, never undefined
	const postId = (post.id || post._id || '').toString();

	// Check if user is the author of this post
	const isAuthor = user?.id === (post.author.id || post.author._id);

	// User can delete if they're the author or an admin
	const canDelete = isAdmin || isAuthor;

	const handleCommentSubmit = () => {
		if (postId) {
			onCommentSubmit(postId);
		}
	};

	const handleTogglePin = () => {
		if (postId) {
			onTogglePin(postId);
		}
	};

	const handleDelete = () => {
		if (postId && canDelete) {
			// Confirm before deletion
			if (window.confirm('Are you sure you want to delete this post?')) {
				onDelete(postId);
			}
		}
	};

	return (
		<div
			className={`bg-card rounded-lg shadow-md overflow-hidden ${
				post.isPinned ? 'border-l-4 border-primary' : ''
			}`}
		>
			<div className='p-6'>
				<div className='flex justify-between items-start'>
					<div className='flex gap-3 items-center mb-4'>
						<div className='w-10 h-10 rounded-full bg-muted flex items-center justify-center'>
							{post.author.name.charAt(0)}
						</div>
						<div>
							<h3 className='font-medium'>{post.author.name}</h3>
							<p className='text-sm text-muted-foreground'>
								{new Date(post.createdAt).toLocaleDateString()}
							</p>
						</div>
					</div>

					{/* Control buttons - show admin pin and/or delete if authorized */}
					<div className='flex gap-2'>
						{isAdmin && (
							<button
								onClick={handleTogglePin}
								className={`p-1 rounded-full hover:bg-muted/50 transition-colors ${
									post.isPinned
										? 'text-primary'
										: 'text-muted-foreground'
								}`}
								title={
									post.isPinned ? 'Unpin post' : 'Pin post'
								}
							>
								<Pin size={18} />
							</button>
						)}

						{canDelete && (
							<button
								onClick={handleDelete}
								className='p-1 rounded-full hover:bg-muted/50 transition-colors text-red-500'
								title='Delete post'
							>
								<Trash2 size={18} />
							</button>
						)}
					</div>
				</div>

				<h2 className='text-xl font-bold mb-2'>{post.title}</h2>
				<p className='mb-4'>{post.content}</p>

				<div className='flex flex-col md:flex-row gap-4 mb-4 text-muted-foreground'>
					{post.eventDate && (
						<div className='flex items-center gap-1'>
							<CalendarIcon size={16} />
							<span>
								{format(
									new Date(post.eventDate),
									"MMM d, yyyy 'at' h:mm a"
								)}
							</span>
						</div>
					)}
					{post.location && (
						<div>
							<span>📍 {post.location}</span>
						</div>
					)}
				</div>

				<CommentSection
					postId={postId}
					comments={post.comments}
					activeCommentPostId={activeCommentPostId}
					newComment={newComment}
					setNewComment={setNewComment}
					setActiveCommentPostId={setActiveCommentPostId}
					onCommentSubmit={handleCommentSubmit}
					currentUserId={user?.id}
					isAdmin={isAdmin}
					onDeleteComment={onDeleteComment}
				/>
			</div>
		</div>
	);
}
