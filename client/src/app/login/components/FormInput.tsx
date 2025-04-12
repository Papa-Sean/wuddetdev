import React from 'react';

type FormInputProps = {
	id: string;
	name: string;
	label: string;
	type?: string;
	value: string;
	error?: string;
	placeholder?: string;
	disabled?: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function FormInput({
	id,
	name,
	label,
	type = 'text',
	value,
	error,
	placeholder,
	disabled,
	onChange,
}: FormInputProps) {
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
