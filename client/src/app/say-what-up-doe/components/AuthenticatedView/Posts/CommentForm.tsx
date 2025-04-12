import React from 'react';

interface CommentFormProps {
	comment: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	onCancel: () => void;
	onSubmit: () => void;
}

export function CommentForm({
	comment,
	onChange,
	onCancel,
	onSubmit,
}: CommentFormProps) {
	return (
		<div className='mt-2'>
			<textarea
				value={comment}
				onChange={onChange}
				placeholder='Add your comment...'
				className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none text-sm'
				rows={2}
				maxLength={280}
			></textarea>
			<div className='flex justify-between mt-1'>
				<span className='text-xs text-muted-foreground'>
					{280 - comment.length} characters remaining
				</span>
				<div className='flex gap-2'>
					<button
						onClick={onCancel}
						className='px-3 py-1 text-sm rounded bg-muted hover:bg-muted/80 transition-colors'
					>
						Cancel
					</button>
					<button
						onClick={onSubmit}
						className='px-3 py-1 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
						disabled={!comment.trim()}
					>
						Post
					</button>
				</div>
			</div>
		</div>
	);
}
