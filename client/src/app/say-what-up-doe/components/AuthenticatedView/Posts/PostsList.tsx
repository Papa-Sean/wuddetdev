import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Post, PostFormData } from '../../types';
import { PostCard } from './PostCard';
import { CreatePostForm } from './CreatePostForm';

interface PostsListProps {
	posts: Post[];
	isAdmin: boolean;
	showNewPostForm: boolean;
	newPostForm: PostFormData;
	activeCommentPostId: string | null;
	newComment: string;
	setNewPostForm: (form: PostFormData) => void;
	setShowNewPostForm: (show: boolean) => void;
	setNewComment: (comment: string) => void;
	setActiveCommentPostId: (id: string | null) => void;
	handleNewPostFormChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	handleNewPostSubmit: (e: React.FormEvent) => void;
	handleCommentSubmit: (postId: string) => void;
	togglePinPost: (postId: string) => void;
	deletePost: (postId: string) => void;
	deleteComment: (postId: string, commentId: string) => void; // Add this line
}

export function PostsList({
	posts,
	isAdmin,
	showNewPostForm,
	newPostForm,
	activeCommentPostId,
	newComment,
	setNewPostForm,
	setShowNewPostForm,
	setNewComment,
	setActiveCommentPostId,
	handleNewPostFormChange,
	handleNewPostSubmit,
	handleCommentSubmit,
	togglePinPost,
	deletePost,
	deleteComment,
}: PostsListProps) {
	return (
		<div>
			{/* "Create Post" button for authenticated users */}
			{!showNewPostForm ? (
				<button
					onClick={() => setShowNewPostForm(true)}
					className='bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors mb-6'
				>
					<MessageSquare size={18} />
					Create New Post
				</button>
			) : (
				<CreatePostForm
					formData={newPostForm}
					onChange={handleNewPostFormChange}
					onSubmit={handleNewPostSubmit}
					onCancel={() => setShowNewPostForm(false)}
				/>
			)}

			{/* Posts List */}
			<div className='space-y-6'>
				{/* Sort posts: pinned first, then by date */}
				{[...posts]
					.sort((a, b) => {
						if (a.isPinned && !b.isPinned) return -1;
						if (!a.isPinned && b.isPinned) return 1;
						return (
							new Date(b.createdAt).getTime() -
							new Date(a.createdAt).getTime()
						);
					})
					.map((post) => (
						<PostCard
							key={post.id || post._id} // <-- Use either id or _id
							post={post}
							isAdmin={isAdmin}
							activeCommentPostId={activeCommentPostId}
							newComment={newComment}
							setNewComment={setNewComment}
							setActiveCommentPostId={setActiveCommentPostId}
							onCommentSubmit={handleCommentSubmit}
							onTogglePin={togglePinPost}
							onDelete={deletePost}
							onDeleteComment={deleteComment} // Add this line to pass the prop
						/>
					))}
			</div>
		</div>
	);
}
