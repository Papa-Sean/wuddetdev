interface TechStackProps {
	technologies: string[];
}

export function TechStack({ technologies }: TechStackProps) {
	return (
		<div className='mb-4'>
			<h3 className='font-semibold mb-2'>Tech Stack:</h3>
			<div className='flex flex-wrap gap-2'>
				{technologies.map((tech) => (
					<span
						key={tech}
						className='bg-muted px-2 py-1 rounded-md text-sm'
					>
						{tech}
					</span>
				))}
			</div>
		</div>
	);
}
