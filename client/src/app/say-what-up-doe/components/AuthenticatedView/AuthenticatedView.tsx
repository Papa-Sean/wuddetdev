import React, { useState } from 'react';
import { Post, PostFormData, GuestMessage } from '../types';
import { AdminTabs } from './AdminTabs';
import { PostsList } from './Posts/PostsList';
import { GuestMessagesList } from './GuestMessages/GuestMessagesList';

interface AuthenticatedViewProps {
	isAdmin: boolean;
	posts: Post[];
	guestMessages: GuestMessage[];
	activeTab: string;
	showNewPostForm: boolean;
	newPostForm: PostFormData;
	activeCommentPostId: string | null;
	newComment: string;
	setActiveTab: (tab: string) => void;
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
	deleteComment: (commentId: string) => void;
	toggleResponseStatus: (messageId: string) => void;
	theme: 'primary' | 'secondary' | 'accent';
}

export function AuthenticatedView({
	isAdmin,
	posts,
	guestMessages,
	activeTab,
	showNewPostForm,
	newPostForm,
	activeCommentPostId,
	newComment,
	setActiveTab,
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
	toggleResponseStatus,
}: AuthenticatedViewProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState('');

	return (
		<>
			{/* Admin Tabs */}
			{isAdmin && (
				<AdminTabs
					activeTab={activeTab}
					setActiveTab={setActiveTab}
				/>
			)}

			{/* Posts Section */}
			{activeTab === 'posts' && (
				<PostsList
					posts={posts}
					isAdmin={isAdmin}
					showNewPostForm={showNewPostForm}
					newPostForm={newPostForm}
					activeCommentPostId={activeCommentPostId}
					newComment={newComment}
					setNewPostForm={setNewPostForm}
					setShowNewPostForm={setShowNewPostForm}
					setNewComment={setNewComment}
					setActiveCommentPostId={setActiveCommentPostId}
					handleNewPostFormChange={handleNewPostFormChange}
					handleNewPostSubmit={handleNewPostSubmit}
					handleCommentSubmit={handleCommentSubmit}
					togglePinPost={togglePinPost}
					deletePost={deletePost}
					deleteComment={deleteComment}
				/>
			)}

			{/* Guest Messages Section (Admin Only) */}
			{isAdmin && activeTab === 'messages' && (
				<GuestMessagesList
					messages={guestMessages}
					toggleResponseStatus={toggleResponseStatus}
				/>
			)}
		</>
	);
}
