import React from 'react';
import { PostFormData } from '../../types';

interface CreatePostFormProps {
	formData: PostFormData;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	onSubmit: (e: React.FormEvent) => void;
	onCancel: () => void;
}

export function CreatePostForm({
	formData,
	onChange,
	onSubmit,
	onCancel,
}: CreatePostFormProps) {
	return (
		<div className='bg-card rounded-lg p-6 shadow-lg mb-6'>
			<h2 className='text-xl font-bold mb-4'>Create New Post</h2>
			<form
				onSubmit={onSubmit}
				className='space-y-4'
			>
				<div>
					<label
						htmlFor='title'
						className='block font-medium mb-1'
					>
						Title
					</label>
					<input
						type='text'
						id='title'
						name='title'
						value={formData.title}
						onChange={onChange}
						className='w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
						required
						maxLength={100}
					/>
				</div>

				<div>
					<label
						htmlFor='content'
						className='block font-medium mb-1'
					>
						Description
					</label>
					<textarea
						id='content'
						name='content'
						value={formData.content}
						onChange={onChange}
						rows={3}
						className='w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
						required
						maxLength={280}
					></textarea>
					<p className='text-sm text-muted-foreground mt-1'>
						{280 - formData.content.length} characters remaining
					</p>
				</div>

				<div>
					<label
						htmlFor='eventDate'
						className='block font-medium mb-1'
					>
						Event Date & Time
					</label>
					<input
						type='datetime-local'
						id='eventDate'
						name='eventDate'
						value={formData.eventDate}
						onChange={onChange}
						className='w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
						required
					/>
				</div>

				<div>
					<label
						htmlFor='location'
						className='block font-medium mb-1'
					>
						Location
					</label>
					<input
						type='text'
						id='location'
						name='location'
						value={formData.location}
						onChange={onChange}
						className='w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
						required
					/>
				</div>

				<div className='flex gap-2'>
					<button
						type='submit'
						className='bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors'
					>
						Post
					</button>
					<button
						type='button'
						onClick={onCancel}
						className='bg-muted px-4 py-2 rounded-md hover:bg-muted/80 transition-colors'
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
