import Link from 'next/link';
import { Share2, Edit, Trash2 } from 'lucide-react';

interface ActionButtonsProps {
	projectId: string;
	isAdmin: boolean;
	onDelete: (id: string) => void;
}

export function ActionButtons({
	projectId,
	isAdmin,
	onDelete,
}: ActionButtonsProps) {
	return (
		<div className='flex space-x-2'>
			{/* Share button - always visible */}
			<button
				className='p-1 rounded-full hover:bg-muted/50 transition-colors'
				title='Share project'
			>
				<Share2 size={18} />
			</button>

			{/* Admin-only buttons */}
			{isAdmin && (
				<>
					<Link
						href={`/portfolio/edit/${projectId}`}
						className='p-1 rounded-full hover:bg-muted/50 transition-colors'
						title='Edit project'
					>
						<Edit size={18} />
					</Link>
					<button
						onClick={() => onDelete(projectId)}
						className='p-1 rounded-full hover:bg-muted/50 transition-colors text-red-500'
						title='Delete project'
					>
						<Trash2 size={18} />
					</button>
				</>
			)}
		</div>
	);
}
