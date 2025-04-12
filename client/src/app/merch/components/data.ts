import { MerchandiseItem } from './types';

// Dummy data representing merchandise
export const dummyMerchItems: MerchandiseItem[] = [
	{
		id: '1',
		name: 'Detroit Dev T-Shirt',
		description:
			'Comfortable cotton t-shirt with Detroit skyline and code design.',
		price: 24.99,
		sizes: ['S', 'M', 'L', 'XL', '2XL'],
		colors: ['Black', 'Navy', 'Gray'],
		image: '/merch/tshirt1.jpg',
		category: 'T-Shirts',
	},
	{
		id: '2',
		name: 'Michigan Coder Hoodie',
		description:
			'Warm pullover hoodie with Michigan outline and developer icons.',
		price: 49.99,
		sizes: ['S', 'M', 'L', 'XL', '2XL'],
		colors: ['Black', 'Blue', 'Gray'],
		image: '/merch/hoodie1.jpg',
		category: 'Hoodies',
	},
	{
		id: '3',
		name: 'What Up Doe Developer Cap',
		description:
			'Adjustable baseball cap with "What Up Doe" in code syntax.',
		price: 22.99,
		sizes: ['One Size'],
		colors: ['Black', 'Navy'],
		image: '/merch/cap1.jpg',
		category: 'Accessories',
	},
	{
		id: '4',
		name: 'Motor City Coder Mug',
		description: '12oz ceramic mug with Detroit tech-inspired designs.',
		price: 14.99,
		sizes: ['Standard'],
		colors: ['Black', 'White'],
		image: '/merch/mug1.jpg',
		category: 'Accessories',
	},
	{
		id: '5',
		name: 'Full Stack Detroit Long Sleeve',
		description:
			'Long sleeve tee with full stack developer tribute to Detroit.',
		price: 29.99,
		sizes: ['S', 'M', 'L', 'XL', '2XL'],
		colors: ['Black', 'Gray', 'Maroon'],
		image: '/merch/longsleeve1.jpg',
		category: 'T-Shirts',
	},
	{
		id: '6',
		name: 'Michigan Dev Stickers Pack',
		description: 'Set of 5 vinyl stickers with Michigan tech themes.',
		price: 9.99,
		sizes: ['Standard'],
		colors: ['Multi'],
		image: '/merch/stickers1.jpg',
		category: 'Accessories',
	},
];
