export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	}).format(date);
}

export function relativeTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffSeconds = Math.floor(diffMs / 1000);
	const diffMinutes = Math.floor(diffSeconds / 60);
	const diffHours = Math.floor(diffMinutes / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffDays > 7) {
		return formatDate(dateString);
	} else if (diffDays > 0) {
		return `${diffDays}d ago`;
	} else if (diffHours > 0) {
		return `${diffHours}h ago`;
	} else if (diffMinutes > 0) {
		return `${diffMinutes}m ago`;
	} else {
		return 'Just now';
	}
}
