'use client';

import React from 'react';
import { FormHeader } from './components/FormHeader';
import { SignupForm } from './components/SignupForm';

export default function SignupPage() {
	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='max-w-md mx-auto'>
				<FormHeader />
				<SignupForm />
			</div>
		</div>
	);
}
