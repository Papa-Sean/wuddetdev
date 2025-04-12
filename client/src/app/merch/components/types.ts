// Define types for our merchandise data
export interface MerchandiseItem {
	id: string;
	name: string;
	description: string;
	price: number;
	sizes: string[];
	colors: string[];
	image: string;
	category: string;
}

// Available category options
export const categories = ['All', 'T-Shirts', 'Hoodies', 'Accessories'];
