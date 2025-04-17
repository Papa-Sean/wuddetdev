import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Inbox, MessageSquare } from 'lucide-react';

type ContentTab = 'posts' | 'projects' | 'comments';
type FilterType = 'all' | 'pinned' | 'featured' | 'flagged';

interface SearchAndFilterBarProps {
	activeTab: ContentTab;
	setActiveTab: (tab: ContentTab) => void;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	filter: FilterType;
	setFilter: (filter: FilterType) => void;
	postsCount: number;
	projectsCount: number;
	commentsCount: number;
	resetSelection: () => void;
}

export function SearchAndFilterBar({
	activeTab,
	setActiveTab,
	searchQuery,
	setSearchQuery,
	filter,
	setFilter,
	postsCount,
	projectsCount,
	commentsCount,
	resetSelection,
}: SearchAndFilterBarProps) {
	const handleTabChange = (value: string) => {
		setActiveTab(value as ContentTab);
		resetSelection();
	};

	// Define these outside the render for cleaner access
	const tabCounts = {
		posts: postsCount,
		projects: projectsCount,
		comments: commentsCount,
	};

	return (
		<>
			{/* Stack on mobile, side-by-side on larger screens */}
			<div className='flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between md:mb-6'>
				{/* Tabs - full width on mobile */}
				<Tabs
					defaultValue={activeTab}
					value={activeTab}
					onValueChange={(value) => handleTabChange(value)}
					className='w-full md:max-w-md'
				>
					<TabsList className='grid w-full grid-cols-3'>
						<TabsTrigger
							value='posts'
							className='flex gap-1 sm:gap-2 items-center px-2 sm:px-4'
						>
							<FileText
								size={14}
								className='md:size-4'
							/>
							<span className='text-xs sm:text-sm'>Posts</span>
							<span className='bg-muted text-xs rounded-full px-1.5 py-0.5 ml-1'>
								{tabCounts.posts}
							</span>
						</TabsTrigger>
						<TabsTrigger
							value='projects'
							className='flex gap-1 sm:gap-2 items-center px-2 sm:px-4'
						>
							<Inbox
								size={14}
								className='md:size-4'
							/>
							<span className='text-xs sm:text-sm'>Projects</span>
							<span className='bg-muted text-xs rounded-full px-1.5 py-0.5 ml-1'>
								{tabCounts.projects}
							</span>
						</TabsTrigger>
						<TabsTrigger
							value='comments'
							className='flex gap-1 sm:gap-2 items-center px-2 sm:px-4'
						>
							<MessageSquare
								size={14}
								className='md:size-4'
							/>
							<span className='text-xs sm:text-sm'>Comments</span>
							<span className='bg-muted text-xs rounded-full px-1.5 py-0.5 ml-1'>
								{tabCounts.comments}
							</span>
						</TabsTrigger>
					</TabsList>
				</Tabs>

				{/* Search Component - full width on mobile, auto width on larger screens */}
				<div className='relative w-full md:w-auto'>
					<Search className='h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground' />
					<input
						type='text'
						placeholder='Search content...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='pl-9 py-2 pr-4 rounded-md border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full'
					/>
				</div>
			</div>

			{/* Filter Bar - properly spaced on mobile */}
			<div className='flex flex-wrap gap-2 sm:gap-3 mb-4 md:mb-6'>
				<Button
					variant={filter === 'all' ? 'default' : 'outline'}
					size='sm'
					onClick={() => setFilter('all')}
					className='text-xs sm:text-sm flex-grow md:flex-grow-0'
				>
					All
				</Button>
				
				{activeTab === 'posts' && (
					<Button
						variant={filter === 'pinned' ? 'default' : 'outline'}
						size='sm'
						onClick={() => setFilter('pinned')}
						className='text-xs sm:text-sm flex-grow md:flex-grow-0'
					>
						Pinned
					</Button>
				)}
				{activeTab === 'projects' && (
					<Button
						variant={filter === 'featured' ? 'default' : 'outline'}
						size='sm'
						onClick={() => setFilter('featured')}
						className='text-xs sm:text-sm flex-grow md:flex-grow-0'
					>
						Featured
					</Button>
				)}
			</div>
		</>
	);
}
