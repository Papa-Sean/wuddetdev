import { ShoppingCart } from 'lucide-react';
import { MerchandiseItem } from './types';
import { getMerchImage } from './utils';

interface MerchCardProps {
	item: MerchandiseItem;
}

export function MerchCard({ item }: MerchCardProps) {
	return (
		<div className='bg-card rounded-lg overflow-hidden shadow-lg transition-transform hover:shadow-xl'>
			{/* Product Image */}
			<div className={`h-64 relative ${getMerchImage(item.image)}`}>
				<div className='absolute inset-0 flex items-center justify-center'>
					<p className='text-xl font-bold'>{item.name.charAt(0)}</p>
				</div>
			</div>

			{/* Product Content */}
			<div className='p-6'>
				<div className='flex justify-between'>
					<h2 className='text-xl font-bold'>{item.name}</h2>
					<span className='font-bold text-primary'>
						${item.price}
					</span>
				</div>

				<p className='text-muted-foreground my-4'>{item.description}</p>

				<div className='flex flex-wrap gap-2 mb-4'>
					{item.sizes.map((size) => (
						<span
							key={size}
							className='bg-muted px-2 py-1 rounded-md text-sm'
						>
							{size}
						</span>
					))}
				</div>

				<div className='flex flex-wrap gap-2 mb-4'>
					{item.colors.map((color) => (
						<span
							key={color}
							className='bg-muted/50 px-2 py-1 rounded-md text-sm'
						>
							{color}
						</span>
					))}
				</div>

				<button className='mt-2 w-full bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors'>
					<ShoppingCart size={18} />
					<span>Add to Cart</span>
				</button>
			</div>
		</div>
	);
}
