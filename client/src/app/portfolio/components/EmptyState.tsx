export function EmptyState() {
	return (
		<div className='text-center py-12'>
			<h2 className='text-2xl font-medium text-muted-foreground'>
				No projects found
			</h2>
			<p className='mt-2'>
				Try adjusting your search or check back later.
			</p>
		</div>
	);
}
