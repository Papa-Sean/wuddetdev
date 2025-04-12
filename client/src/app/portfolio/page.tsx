'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from './components/PageHeader';
import { ProjectGrid } from './components/ProjectGrid';
import { ProjectForm } from './components/ProjectForm';
import { Project } from './components/types';
import { projectsApi, ProjectData } from '@/lib/api/projects';
import { dummyProjects } from './components/data'; // Fallback data

export default function PortfolioPage() {
	// Get auth state from context
	const { user, isAuthenticated, isLoading: authLoading } = useAuth();
	const isAdmin = user?.role === 'admin';

	// State for projects and UI
	const [projects, setProjects] = useState<Project[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [showAddForm, setShowAddForm] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Load projects from MongoDB
	useEffect(() => {
		async function loadProjects() {
			setIsLoading(true);
			setError('');

			try {
				const data = await projectsApi.getProjects();
				setProjects(data);
			} catch (err) {
				console.error('Failed to load projects:', err);
				setError('Failed to load projects. Using sample data instead.');
				setProjects(dummyProjects); // Fallback to dummy data on error
			} finally {
				setIsLoading(false);
			}
		}

		loadProjects();
	}, []);

	// Filter projects based on search query
	const filteredProjects = projects.filter(
		(project) =>
			project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			project.description
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			project.techStack.some((tech) =>
				tech.toLowerCase().includes(searchQuery.toLowerCase())
			)
	);

	// Handle project deletion (admin only)
	const deleteProject = async (id: string) => {
		if (!isAdmin) return;

		if (!window.confirm('Are you sure you want to delete this project?')) {
			return;
		}

		try {
			await projectsApi.deleteProject(id);
			setProjects(projects.filter((project) => project.id !== id));
		} catch (err) {
			console.error('Failed to delete project:', err);
			alert('Failed to delete project. Please try again.');
		}
	};

	// Handle project creation (admin only)
	const addProject = async (projectData: ProjectData) => {
		if (!isAdmin) return;

		setIsSubmitting(true);

		try {
			const newProject = await projectsApi.createProject(projectData);
			setProjects([newProject, ...projects]);
			setShowAddForm(false);
		} catch (err) {
			console.error('Failed to create project:', err);
			alert('Failed to create project. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	// If still loading auth, show loading indicator
	if (authLoading) {
		return (
			<div className='h-screen flex items-center justify-center'>
				<div className='animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full'></div>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<PageHeader
				isLoggedIn={isAuthenticated}
				isAdmin={isAdmin}
				toggleLogin={() => {}} // Remove mock toggle, using real auth now
				toggleAdmin={() => {}} // Remove mock toggle, using real auth now
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				onAddProject={() => setShowAddForm(true)}
			/>

			{error && (
				<div className='bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-6'>
					<p>{error}</p>
				</div>
			)}

			{showAddForm && isAdmin ? (
				<ProjectForm
					onSubmit={addProject}
					onCancel={() => setShowAddForm(false)}
					isSubmitting={isSubmitting}
				/>
			) : (
				<ProjectGrid
					projects={filteredProjects}
					isLoading={isLoading}
					isAdmin={isAdmin}
					onDelete={deleteProject}
				/>
			)}
		</div>
	);
}
