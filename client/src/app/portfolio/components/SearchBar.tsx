interface SearchBarProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
}

export function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
	return (
		<input
			type='text'
			placeholder='Search projects...'
			value={searchQuery}
			onChange={(e) => setSearchQuery(e.target.value)}
			className='px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none'
		/>
	);
}
