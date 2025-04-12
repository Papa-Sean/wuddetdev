import { Project } from './types';
import { ProjectCard } from './ProjectCard';
import { EmptyState } from './EmptyState';

interface ProjectGridProps {
	projects: Project[];
	isAdmin: boolean;
	isLoading?: boolean;
	onDelete: (id: string) => void;
}

export function ProjectGrid({
	projects,
	isAdmin,
	isLoading = false,
	onDelete,
}: ProjectGridProps) {
	// Loading state
	if (isLoading) {
		return (
			<div className='flex justify-center items-center py-12'>
				<div className='animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full'></div>
			</div>
		);
	}

	// Empty state
	if (projects.length === 0) {
		return <EmptyState />;
	}

	// Display projects
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
			{projects.map((project) => (
				<ProjectCard
					key={project.id}
					project={project}
					isAdmin={isAdmin}
					onDelete={onDelete}
				/>
			))}
		</div>
	);
}
