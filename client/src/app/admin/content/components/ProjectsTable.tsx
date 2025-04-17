import React from 'react';
import { ContentProject } from '@/lib/api/content';
import { format } from 'date-fns';
import {
	Pin,
	Trash2,
	ChevronUp,
	ChevronDown,
	Pencil,
	MoreHorizontal,
	ExternalLink,
	Github,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentPagination } from './ContentPagination';
import { LoadingState } from './ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

interface ProjectsTableProps {
	projects: ContentProject[];
	isLoading: boolean;
	error: string | null;
	selectedItems: string[];
	expandedItems: string[];
	toggleSelectItem: (id: string) => void;
	toggleItemExpansion: (id: string) => void;
	toggleSelectAll: () => void;
	handleContentAction: (
		action: string,
		itemType: 'project',
		itemId?: string
	) => void;
	isActionLoading: boolean;
	resetFilters: () => void;
	currentPage: number;
	totalPages: number;
	setCurrentPage: (page: number) => void;
	viewMode: 'table' | 'cards';
}

export function ProjectsTable({
	projects,
	isLoading,
	error,
	selectedItems,
	expandedItems,
	toggleSelectItem,
	toggleItemExpansion,
	toggleSelectAll,
	handleContentAction,
	isActionLoading,
	resetFilters,
	currentPage,
	totalPages,
	setCurrentPage,
	viewMode,
}: ProjectsTableProps) {
	const formatDate = (dateString: string) => {
		try {
			return format(new Date(dateString), 'MMM d, yyyy');
		} catch (e) {
			return 'Invalid date';
		}
	};

	const truncateText = (text: string, maxLength: number) => {
		if (!text) return '';
		return text.length > maxLength
			? text.substring(0, maxLength) + '...'
			: text;
	};

	if (isLoading) return <LoadingState />;
	if (error)
		return (
			<ErrorState
				message={error}
				onRetry={resetFilters}
			/>
		);
	if (projects.length === 0) {
		return (
			<EmptyState
				message='No projects match your filters'
				resetFilters={resetFilters}
			/>
		);
	}

	// Render expanded project content
	const renderExpandedProjectContent = (project: ContentProject) => (
		<div className='w-full space-y-4'>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 w-full'>
				<div className='w-full min-w-0'>
					<h4 className='font-medium text-sm mb-2'>Description</h4>
					<div className='bg-muted/20 p-3 rounded-md overflow-hidden'>
						<p className='text-sm break-words whitespace-pre-wrap max-h-40 overflow-y-auto'>
							{project.description || 'No description available'}
						</p>
					</div>

					<h4 className='font-medium text-sm mt-4 mb-2'>
						Technologies
					</h4>
					<div className='flex flex-wrap gap-1'>
						{project.technologies?.length ? (
							project.technologies.map((tech, i) => (
								<span
									key={i}
									className='bg-muted px-2 py-1 rounded-md text-xs'
								>
									{tech}
								</span>
							))
						) : (
							<span className='text-muted-foreground text-sm'>
								No technologies listed
							</span>
						)}
					</div>
				</div>

				<div className='w-full min-w-0'>
					<h4 className='font-medium text-sm mb-2'>Details</h4>
					<div className='space-y-2 text-sm'>
						{project.liveUrl && (
							<div className='flex flex-wrap justify-between gap-x-2'>
								<span className='text-muted-foreground'>
									Live URL:
								</span>
								<a
									href={project.liveUrl}
									target='_blank'
									rel='noopener noreferrer'
									className='text-primary underline max-w-[200px] truncate hover:text-clip hover:overflow-visible'
									title={project.liveUrl}
								>
									<span className='flex items-center'>
										View Site{' '}
										<ExternalLink
											size={12}
											className='ml-1'
										/>
									</span>
								</a>
							</div>
						)}
						{project.repoUrl && (
							<div className='flex flex-wrap justify-between gap-x-2'>
								<span className='text-muted-foreground'>
									Repository:
								</span>
								<a
									href={project.repoUrl}
									target='_blank'
									rel='noopener noreferrer'
									className='text-primary underline max-w-[200px] truncate hover:text-clip hover:overflow-visible'
									title={project.repoUrl}
								>
									<span className='flex items-center'>
										View Code{' '}
										<Github
											size={12}
											className='ml-1'
										/>
									</span>
								</a>
							</div>
						)}

						<div className='flex flex-wrap justify-between gap-x-2'>
							<span className='text-muted-foreground'>
								Created:
							</span>
							<span>{formatDate(project.createdAt)}</span>
						</div>
						{project.updatedAt && (
							<div className='flex flex-wrap justify-between gap-x-2'>
								<span className='text-muted-foreground'>
									Updated:
								</span>
								<span>{formatDate(project.updatedAt)}</span>
							</div>
						)}
						<div className='flex flex-wrap justify-between gap-x-2'>
							<span className='text-muted-foreground'>ID:</span>
							<span className='font-mono text-xs max-w-full overflow-hidden text-ellipsis'>
								{project._id || project.id}
							</span>
						</div>
					</div>

					<div className='mt-4 flex flex-wrap gap-2'>
						<Button
							size='sm'
							variant='outline'
							className='flex-1 min-w-[100px]'
						>
							<Pencil
								size={14}
								className='mr-1 flex-shrink-0'
							/>
							<span className='truncate'>Edit</span>
						</Button>
						<Button
							size='sm'
							variant='outline'
							className='flex-1 min-w-[100px] text-red-600 border-red-200 hover:bg-red-50'
							onClick={() =>
								handleContentAction(
									'delete',
									'project',
									project._id || project.id
								)
							}
							disabled={isActionLoading}
						>
							<Trash2
								size={14}
								className='mr-1 flex-shrink-0'
							/>
							<span className='truncate'>Delete</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<>
			{selectedItems.length > 0 && (
				<div className='bg-muted/30 border-b border-border p-3 flex flex-wrap items-center justify-between gap-2'>
					<span className='text-sm'>
						{selectedItems.length} item(s) selected
					</span>
					<div className='flex flex-wrap gap-2'>
						<Button
							size='sm'
							variant='outline'
							onClick={() =>
								handleContentAction('pin', 'project')
							}
							disabled={isActionLoading}
						>
							<Pin
								size={14}
								className='mr-1'
							/>
							Feature
						</Button>
						<Button
							size='sm'
							variant='outline'
							onClick={() =>
								handleContentAction('unpin', 'project')
							}
							disabled={isActionLoading}
						>
							<Pin
								size={14}
								className='mr-1'
							/>
							Unfeature
						</Button>
						<Button
							size='sm'
							variant='outline'
							className='text-red-600 border-red-200 hover:bg-red-50'
							onClick={() =>
								handleContentAction('delete', 'project')
							}
							disabled={isActionLoading}
						>
							<Trash2
								size={14}
								className='mr-1'
							/>
							Delete
						</Button>
					</div>
				</div>
			)}

			{viewMode === 'table' && (
				<div className='hidden md:block w-full'>
					<div className='w-full overflow-x-auto'>
						<table className='w-full table-fixed'>
							<thead className='bg-muted/50 text-left'>
								<tr>
									<th className='px-6 py-3 w-8'>
										<input
											type='checkbox'
											checked={
												selectedItems.length ===
													projects.length &&
												projects.length > 0
											}
											onChange={toggleSelectAll}
											className='w-4 h-4 rounded border-gray-300'
										/>
									</th>
									<th className='px-6 py-3 font-medium w-[30%]'>
										Project
									</th>
									<th className='px-6 py-3 font-medium w-[15%]'>
										Author
									</th>
									<th className='px-6 py-3 font-medium w-[15%]'>
										Date
									</th>
									<th className='px-6 py-3 font-medium w-[20%]'>
										Technologies
									</th>
									<th className='px-6 py-3 font-medium w-[10%]'>
										Status
									</th>
									<th className='px-6 py-3 font-medium w-[10%]'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-border'>
								{projects.map((project) => {
									const projectId = project._id || project.id;
									const isExpanded =
										expandedItems.includes(projectId);

									return (
										<React.Fragment key={projectId}>
											<tr
												className={cn(
													'hover:bg-muted/30 transition-colors',
													isExpanded && 'bg-muted/20'
												)}
											>
												<td className='px-6 py-4'>
													<input
														type='checkbox'
														checked={selectedItems.includes(
															projectId
														)}
														onChange={() =>
															toggleSelectItem(
																projectId
															)
														}
														onClick={(e) =>
															e.stopPropagation()
														}
														className='w-4 h-4 rounded border-gray-300'
													/>
												</td>
												<td
													className='px-6 py-4 cursor-pointer'
													onClick={() =>
														toggleItemExpansion(
															projectId
														)
													}
												>
													<div className='font-medium flex items-center'>
														{project.featured && (
															<Pin
																size={14}
																className='text-primary mr-2'
															/>
														)}
														<span
															className='truncate'
															title={
																project.title
															}
														>
															{truncateText(
																project.title,
																50
															)}
														</span>
													</div>
												</td>
												<td className='px-6 py-4 text-sm text-muted-foreground truncate'>
													{project.author?.name ||
														'Unknown'}
												</td>
												<td className='px-6 py-4 text-sm whitespace-nowrap'>
													{formatDate(
														project.createdAt
													)}
												</td>
												<td className='px-6 py-4 text-sm'>
													<div className='flex flex-wrap gap-1'>
														{project.technologies
															?.slice(0, 2)
															.map((tech, i) => (
																<span
																	key={i}
																	className='bg-muted px-1.5 py-0.5 rounded text-xs'
																>
																	{tech}
																</span>
															))}
														{(project.technologies
															?.length || 0) >
															2 && (
															<span className='text-xs text-muted-foreground'>
																+
																{project.technologies!
																	.length -
																	2}{' '}
																more
															</span>
														)}
													</div>
												</td>
												<td className='px-6 py-4'>
													<span
														className={cn(
															'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
															project.featured
																? 'bg-primary/10 text-primary'
																: 'bg-muted text-muted-foreground'
														)}
													>
														{project.featured
															? 'Featured'
															: 'Published'}
													</span>
												</td>
												<td className='px-6 py-4'>
													<div className='flex items-center'>
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8'
															onClick={() =>
																toggleItemExpansion(
																	projectId
																)
															}
														>
															{isExpanded ? (
																<ChevronUp
																	size={16}
																/>
															) : (
																<ChevronDown
																	size={16}
																/>
															)}
														</Button>
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8'
														>
															<MoreHorizontal
																size={16}
															/>
														</Button>
													</div>
												</td>
											</tr>

											{isExpanded && (
												<tr className='bg-muted/10'>
													<td
														colSpan={7}
														className='px-2 sm:px-4 md:px-6 py-4 w-full'
													>
														<div className='animate-in fade-in-0 slide-in-from-top-1 duration-200 w-full'>
															{renderExpandedProjectContent(
																project
															)}
														</div>
													</td>
												</tr>
											)}
										</React.Fragment>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			)}

			<div
				className={viewMode === 'table' ? 'md:hidden w-full' : 'w-full'}
			>
				<div className='p-2 sm:p-4 space-y-4 w-full'>
					{projects.map((project) => {
						const projectId = project._id || project.id;
						const isExpanded = expandedItems.includes(projectId);

						return (
							<div
								key={projectId}
								className='border border-border rounded-lg overflow-hidden bg-card w-full'
							>
								<div
									className='p-4 flex justify-between cursor-pointer'
									onClick={() =>
										toggleItemExpansion(projectId)
									}
								>
									<div className='flex-1 min-w-0'>
										<div className='flex items-center gap-2 mb-2'>
											<input
												type='checkbox'
												checked={selectedItems.includes(
													projectId
												)}
												onChange={(e) => {
													e.stopPropagation();
													toggleSelectItem(projectId);
												}}
												className='w-4 h-4 rounded border-gray-300'
											/>
											<h3 className='font-medium flex items-center'>
												{project.featured && (
													<Pin
														size={14}
														className='text-primary mr-1 flex-shrink-0'
													/>
												)}
												<span
													className='truncate'
													title={project.title}
												>
													{truncateText(
														project.title,
														40
													)}
												</span>
											</h3>
										</div>

										<div className='text-sm text-muted-foreground mb-1 truncate'>
											By{' '}
											{project.author?.name || 'Unknown'}{' '}
											· {formatDate(project.createdAt)}
										</div>

										<div className='flex flex-wrap gap-1 mt-1'>
											{project.technologies
												?.slice(0, 2)
												.map((tech, i) => (
													<span
														key={i}
														className='bg-muted px-1.5 py-0.5 rounded text-xs'
													>
														{tech}
													</span>
												))}
											{(project.technologies?.length ||
												0) > 2 && (
												<span className='text-xs text-muted-foreground'>
													+
													{project.technologies!
														.length - 2}{' '}
													more
												</span>
											)}
										</div>
									</div>

									<div className='flex items-center ml-3 flex-shrink-0'>
										{isExpanded ? (
											<ChevronUp size={16} />
										) : (
											<ChevronDown size={16} />
										)}
									</div>
								</div>

								{isExpanded && (
									<div className='border-t border-border bg-muted/10 animate-in fade-in-0 slide-in-from-top-1 duration-200'>
										<div className='p-2 sm:p-4 w-full overflow-hidden'>
											{renderExpandedProjectContent(
												project
											)}
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>

			<ContentPagination
				currentPage={currentPage}
				totalPages={totalPages}
				itemsShowing={projects.length}
				totalItems={projects.length}
				itemType='projects'
				onPageChange={setCurrentPage}
			/>
		</>
	);
}
