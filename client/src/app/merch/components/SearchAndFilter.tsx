import { Search } from 'lucide-react';
import { categories } from './types';

interface SearchAndFilterProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	selectedCategory: string;
	setSelectedCategory: (category: string) => void;
}

export function SearchAndFilter({
	searchQuery,
	setSearchQuery,
	selectedCategory,
	setSelectedCategory,
}: SearchAndFilterProps) {
	return (
		<div className='flex flex-col md:flex-row justify-between items-center mb-8 gap-4'>
			<div className='relative w-full md:w-1/3'>
				<Search
					className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground'
					size={18}
				/>
				<input
					type='text'
					placeholder='Search merchandise...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='pl-10 px-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
				/>
			</div>

			<div className='flex gap-2 w-full md:w-auto'>
				{categories.map((category) => (
					<button
						key={category}
						className={`px-4 py-2 rounded-md ${
							selectedCategory === category
								? 'bg-primary text-primary-foreground'
								: 'bg-muted hover:bg-muted/80'
						}`}
						onClick={() => setSelectedCategory(category)}
					>
						{category}
					</button>
				))}
			</div>
		</div>
	);
}
