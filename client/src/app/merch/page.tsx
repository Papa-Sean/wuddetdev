'use client';

import { useState } from 'react';
import { MerchandiseItem } from './components/types';
import { dummyMerchItems } from './components/data';
import { MerchHeader } from './components/MerchHeader';
import { SearchAndFilter } from './components/SearchAndFilter';
import { ShopifyNotice } from './components/ShopifyNotice';
import { EmptyState } from './components/EmptyState';
import { MerchCard } from './components/MerchCard';
import { HelpSection } from './components/HelpSection';

export default function MerchPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('All');

	// Filter merchandise based on search query and category
	const filteredMerch = dummyMerchItems.filter((item) => {
		const matchesSearch =
			item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.description.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesCategory =
			selectedCategory === 'All' || item.category === selectedCategory;

		return matchesSearch && matchesCategory;
	});

	return (
		<div className='container mx-auto px-4 py-8'>
			{/* Header Section */}
			<MerchHeader />

			{/* Search and Filter Section */}
			<SearchAndFilter
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				selectedCategory={selectedCategory}
				setSelectedCategory={setSelectedCategory}
			/>

			{/* Shopify Integration Notice */}
			<ShopifyNotice />

			{/* Merchandise Grid */}
			{filteredMerch.length === 0 ? (
				<EmptyState />
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
					{filteredMerch.map((item) => (
						<MerchCard
							key={item.id}
							item={item}
						/>
					))}
				</div>
			)}

			{/* Help Section */}
			<HelpSection />
		</div>
	);
}
