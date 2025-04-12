import React from 'react';
import { MessageCircle, Trash2 } from 'lucide-react';
import { Comment } from '../../types';
import { CommentForm } from './CommentForm';

interface CommentSectionProps {
	postId: string;
	comments: Comment[];
	activeCommentPostId: string | null;
	newComment: string;
	setNewComment: (comment: string) => void;
	setActiveCommentPostId: (id: string | null) => void;
	onCommentSubmit: (postId: string) => void;
	currentUserId?: string; // Add current user ID to check permissions
	isAdmin: boolean; // Add admin status to check permissions
	onDeleteComment?: (postId: string, commentId: string) => void; // Add delete handler
}

export function CommentSection({
	postId,
	comments,
	activeCommentPostId,
	newComment,
	setNewComment,
	setActiveCommentPostId,
	onCommentSubmit,
	currentUserId,
	isAdmin,
	onDeleteComment,
}: CommentSectionProps) {
	const handleDeleteComment = (commentId: string) => {
		if (
			onDeleteComment &&
			window.confirm('Are you sure you want to delete this comment?')
		) {
			onDeleteComment(postId, commentId);
		}
	};

	return (
		<div className='mt-6 pt-4 border-t'>
			<h4 className='font-medium mb-2 flex items-center gap-1'>
				<MessageCircle size={16} />
				Comments ({comments.length})
			</h4>

			{comments.length > 0 && (
				<div className='space-y-4 mb-4'>
					{comments.map((comment) => {
						// Get the proper comment ID
						const commentId = comment.id || comment._id;

						// Check if user can delete this comment
						const isCommentAuthor =
							currentUserId ===
							(comment.author.id || comment.author._id);
						const canDeleteComment = isAdmin || isCommentAuthor;

						return (
							<div
								key={commentId}
								className='bg-muted/30 p-3 rounded-md'
							>
								<div className='flex justify-between'>
									<div className='flex items-center gap-2 mb-1'>
										<div className='w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs'>
											{comment.author.name.charAt(0)}
										</div>
										<span className='font-medium text-sm'>
											{comment.author.name}
										</span>
									</div>
									<div className='flex items-center'>
										<span className='text-xs text-muted-foreground'>
											{new Date(
												comment.createdAt
											).toLocaleDateString()}
										</span>

										{/* Delete button for comment */}
										{canDeleteComment &&
											onDeleteComment && (
												<button
													onClick={() =>
														handleDeleteComment(
															commentId
														)
													}
													className='ml-2 p-1 text-red-500 hover:bg-muted/50 rounded-full'
													title='Delete comment'
												>
													<Trash2 size={14} />
												</button>
											)}
									</div>
								</div>
								<p className='text-sm'>{comment.content}</p>
							</div>
						);
					})}
				</div>
			)}

			{activeCommentPostId === postId ? (
				<CommentForm
					comment={newComment}
					onChange={(e) => setNewComment(e.target.value)}
					onCancel={() => {
						setActiveCommentPostId(null);
						setNewComment('');
					}}
					onSubmit={() => onCommentSubmit(postId)}
				/>
			) : (
				<button
					onClick={() => setActiveCommentPostId(postId)}
					className='text-sm text-primary font-medium hover:underline'
				>
					Add a comment...
				</button>
			)}
		</div>
	);
}
