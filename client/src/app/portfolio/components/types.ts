export interface Project {
	id: string;
	_id?: string; // MongoDB ID
	title: string;
	description: string;
	techStack: string[];
	prototypeUrl: string;
	image: string;
	creator: string;
}
