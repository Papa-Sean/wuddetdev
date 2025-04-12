import React from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

type PasswordInputProps = {
	value: string;
	error?: string;
	disabled?: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	showForgotPassword?: boolean;
};

export function PasswordInput({
	value,
	error,
	disabled,
	onChange,
	showForgotPassword = true,
}: PasswordInputProps) {
	const [showPassword, setShowPassword] = React.useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	return (
		<div>
			<div className='flex justify-between items-center mb-1'>
				<label
					htmlFor='password'
					className='block font-medium'
				>
					Password
				</label>
				{showForgotPassword && (
					<Link
						href='/forgot-password'
						className='text-sm text-primary hover:underline'
					>
						Forgot password?
					</Link>
				)}
			</div>
			<div className='relative'>
				<input
					type={showPassword ? 'text' : 'password'}
					id='password'
					name='password'
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
