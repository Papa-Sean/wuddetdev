export function formatDate(dateString: string | null | undefined) {
	if (!dateString) return 'Never';
	const date = new Date(dateString);
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	}).format(date);
}

export function getTimeAgo(dateString: string | null | undefined) {
	if (!dateString) return 'Never';

	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return 'Today';
	if (diffDays === 1) return 'Yesterday';
	if (diffDays < 30) return `${diffDays} days ago`;

	const diffMonths = Math.floor(diffDays / 30);
	return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
}
