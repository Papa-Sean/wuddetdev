import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
	id: string;
	name: string;
	label: string;
	value: string;
	error?: string;
	disabled?: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordField({
	id,
	name,
	label,
	value,
	error,
	disabled,
	onChange,
}: PasswordFieldProps) {
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	return (
		<div>
			<label
				htmlFor={id}
				className='block font-medium mb-1'
			>
				{label}
			</label>
			<div className='relative'>
				<input
					type={showPassword ? 'text' : 'password'}
					id={id}
					name={name}
					value={value}
					onChange={onChange}
					className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none ${
						error ? 'border-red-500' : 'border-gray-300'
					}`}
					placeholder='••••••••'
					disabled={disabled}
				/>
				<button
					type='button'
					onClick={togglePasswordVisibility}
					className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'
				>
					{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
				</button>
			</div>
			{error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
		</div>
	);
}
