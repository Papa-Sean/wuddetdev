export const formatNumber = (num: number | null | undefined) => {
	if (num === null || num === undefined) return '0';
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, '0')}`;
};
