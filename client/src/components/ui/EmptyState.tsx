import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    message: string;
    resetFilters: () => void;
}

export function EmptyState({ message, resetFilters }: EmptyStateProps) {
    return (
        <div className='p-8 text-center'>
            <Filter className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
            <p className='text-lg font-medium'>{message}</p>
            <Button
                onClick={resetFilters}
                variant='outline'
                className='mt-4'
            >
                Clear Filters
            </Button>
        </div>
    );
}
