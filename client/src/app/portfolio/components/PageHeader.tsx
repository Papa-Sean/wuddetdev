import Link from 'next/link';
import { Plus } from 'lucide-react';
import { SearchBar } from './SearchBar';

interface PageHeaderProps {
	isLoggedIn: boolean;
	isAdmin: boolean;
	toggleLogin: () => void;
	toggleAdmin: () => void;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	onAddProject?: () => void; // New prop for adding projects
}

export function PageHeader({
	isLoggedIn,
	isAdmin,
	toggleLogin,
	toggleAdmin,
	searchQuery,
	setSearchQuery,
	onAddProject,
}: PageHeaderProps) {
	return (
		<div className='mb-8'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-3xl font-bold'>Portfolio</h1>

				{/* Authentication buttons - keep for debugging in development if needed */}
				{process.env.NODE_ENV === 'development' && (
					<div className='flex gap-2'>
						<button
							onClick={toggleLogin}
							className='px-4 py-2 border border-gray-300 rounded-md hover:bg-muted transition-colors'
						>
							{isLoggedIn ? 'Log Out' : 'Log In'}
						</button>
						<button
							className='px-4 py-2 border border-gray-300 rounded-md hover:bg-muted transition-colors'
							onClick={toggleAdmin}
							disabled={!isLoggedIn}
						>
							{isAdmin ? 'Admin' : 'Member'}
						</button>
					</div>
				)}
			</div>

			<div className='flex flex-col md:flex-row gap-4 justify-between md:items-center'>
				<p className='text-muted-foreground max-w-2xl'>
					Explore our portfolio of web development projects focused on
					the Detroit tech community. These projects showcase modern
					web technologies and local collaborations.
				</p>

				<div className='flex gap-4 items-center'>
					<SearchBar
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
					/>

					{isAdmin && onAddProject && (
						<button
							onClick={onAddProject}
							className='flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors'
						>
							<Plus size={16} />
							<span>Add Project</span>
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
