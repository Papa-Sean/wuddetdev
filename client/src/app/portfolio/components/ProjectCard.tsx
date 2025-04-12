import { Project } from './types';
import { getProjectImage } from './utils';
import { ActionButtons } from './ActionButtons';
import { TechStack } from './TechStack';

interface ProjectCardProps {
	project: Project;
	isAdmin: boolean;
	onDelete: (id: string) => void;
}

export function ProjectCard({ project, isAdmin, onDelete }: ProjectCardProps) {
	// Use a safe way to get project ID
	const projectId = project.id || project._id;

	return (
		<div className='bg-card rounded-lg overflow-hidden shadow-lg transition-transform hover:shadow-xl'>
			{/* Project image */}
			<div className={`h-48 relative ${getProjectImage(project.image)}`}>
				<div className='absolute inset-0 flex items-center justify-center'>
					<p className='text-xl font-bold'>
						{project.title ? project.title.charAt(0) : 'P'}
					</p>
				</div>
			</div>

			{/* Project content */}
			<div className='p-6'>
				<div className='flex justify-between items-start mb-4'>
					<h2 className='text-xl font-bold'>
						{project.title || 'Untitled Project'}
					</h2>

					<ActionButtons
						projectId={projectId}
						isAdmin={isAdmin}
						onDelete={onDelete}
					/>
				</div>

				<p className='text-muted-foreground mb-4'>
					{project.description || 'No description available'}
				</p>

				<TechStack technologies={project.techStack || []} />

				<a
					href={project.prototypeUrl || '#'}
					target='_blank'
					rel='noopener noreferrer'
					className='text-primary font-medium hover:underline inline-block mt-2'
				>
					View Prototype
				</a>
			</div>
		</div>
	);
}
