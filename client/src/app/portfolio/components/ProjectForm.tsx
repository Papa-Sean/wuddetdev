import React, { useState } from 'react';
import { ProjectData } from '@/lib/api/projects';
import { X } from 'lucide-react';

interface ProjectFormProps {
	onSubmit: (project: ProjectData) => Promise<void>;
	onCancel: () => void;
	isSubmitting: boolean;
}

export function ProjectForm({
	onSubmit,
	onCancel,
	isSubmitting,
}: ProjectFormProps) {
	const [formData, setFormData] = useState<ProjectData>({
		title: '',
		description: '',
		techStack: [],
		prototypeUrl: '',
		image: '',
	});

	const [techInput, setTechInput] = useState('');
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		// Clear error when user types
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: '' }));
		}
	};

	const handleTechInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTechInput(e.target.value);
	};

	const addTech = () => {
		if (techInput.trim()) {
			setFormData((prev) => ({
				...prev,
				techStack: [...prev.techStack, techInput.trim()],
			}));
			setTechInput('');
		}
	};

	const removeTech = (index: number) => {
		setFormData((prev) => ({
			...prev,
			techStack: prev.techStack.filter((_, i) => i !== index),
		}));
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTech();
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.title.trim()) {
			newErrors.title = 'Title is required';
		}

		if (!formData.description.trim()) {
			newErrors.description = 'Description is required';
		}

		if (formData.techStack.length === 0) {
			newErrors.techStack = 'At least one technology is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		try {
			await onSubmit(formData);
		} catch (error) {
			console.error('Error submitting project:', error);
		}
	};

	return (
		<div className='bg-card p-6 rounded-lg shadow-lg max-w-2xl mx-auto'>
			<h2 className='text-2xl font-bold mb-6'>Add New Project</h2>

			<form
				onSubmit={handleSubmit}
				className='space-y-4'
			>
				<div>
					<label
						htmlFor='title'
						className='block font-medium mb-1'
					>
						Project Title*
					</label>
					<input
						type='text'
						id='title'
						name='title'
						value={formData.title}
						onChange={handleChange}
						className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none ${
							errors.title ? 'border-red-500' : 'border-gray-300'
						}`}
						disabled={isSubmitting}
					/>
					{errors.title && (
						<p className='mt-1 text-sm text-red-500'>
							{errors.title}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor='description'
						className='block font-medium mb-1'
					>
						Description*
					</label>
					<textarea
						id='description'
						name='description'
						value={formData.description}
						onChange={handleChange}
						rows={4}
						className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none ${
							errors.description
								? 'border-red-500'
								: 'border-gray-300'
						}`}
						disabled={isSubmitting}
					/>
					{errors.description && (
						<p className='mt-1 text-sm text-red-500'>
							{errors.description}
						</p>
					)}
				</div>

				<div>
					<label className='block font-medium mb-1'>
						Technologies*
					</label>
					<div className='flex items-center gap-2 mb-2'>
						<input
							type='text'
							value={techInput}
							onChange={handleTechInputChange}
							onKeyDown={handleKeyDown}
							placeholder='Add a technology and press Enter'
							className='flex-grow px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
							disabled={isSubmitting}
						/>
						<button
							type='button'
							onClick={addTech}
							className='bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50'
							disabled={isSubmitting || !techInput.trim()}
						>
							Add
						</button>
					</div>

					<div className='flex flex-wrap gap-2 mt-2'>
						{formData.techStack.map((tech, index) => (
							<div
								key={index}
								className='bg-muted px-3 py-1 rounded-full flex items-center gap-1'
							>
								<span>{tech}</span>
								<button
									type='button'
									onClick={() => removeTech(index)}
									className='text-muted-foreground hover:text-foreground'
									disabled={isSubmitting}
								>
									<X size={14} />
								</button>
							</div>
						))}
					</div>

					{errors.techStack && (
						<p className='mt-1 text-sm text-red-500'>
							{errors.techStack}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor='prototypeUrl'
						className='block font-medium mb-1'
					>
						Prototype URL
					</label>
					<input
						type='url'
						id='prototypeUrl'
						name='prototypeUrl'
						value={formData.prototypeUrl}
						onChange={handleChange}
						className='w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none border-gray-300'
						disabled={isSubmitting}
					/>
				</div>

				<div>
					<label
						htmlFor='image'
						className='block font-medium mb-1'
					>
						Image URL
					</label>
					<input
						type='url'
						id='image'
						name='image'
						value={formData.image}
						onChange={handleChange}
						className='w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none border-gray-300'
						disabled={isSubmitting}
						placeholder='e.g., /portfolio/project1.jpg'
					/>
					<p className='text-xs text-muted-foreground mt-1'>
						You can use placeholder paths like
						'/portfolio/project1.jpg' for testing
					</p>
				</div>

				<div className='flex justify-end gap-3 pt-4'>
					<button
						type='button'
						onClick={onCancel}
						className='px-4 py-2 border border-gray-300 rounded-md hover:bg-muted transition-colors'
						disabled={isSubmitting}
					>
						Cancel
					</button>
					<button
						type='submit'
						className='bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50'
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Saving...' : 'Save Project'}
					</button>
				</div>
			</form>
		</div>
	);
}
