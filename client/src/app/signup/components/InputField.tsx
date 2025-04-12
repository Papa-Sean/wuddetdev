import React from 'react';

interface InputFieldProps {
	id: string;
	name: string;
	label: string;
	type?: string;
	value: string;
	placeholder?: string;
	error?: string;
	disabled?: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputField({
	id,
	name,
	label,
	type = 'text',
	value,
	placeholder,
	error,
	disabled,
	onChange,
}: InputFieldProps) {
	return (
		<div>
			<label
				htmlFor={id}
				className='block font-medium mb-1'
			>
				{label}
			</label>
			<input
				type={type}
				id={id}
				name={name}
				value={value}
				onChange={onChange}
				className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none ${
					error ? 'border-red-500' : 'border-gray-300'
				}`}
				placeholder={placeholder}
				disabled={disabled}
			/>
			{error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
		</div>
	);
}
