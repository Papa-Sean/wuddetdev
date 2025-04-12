import { FooterBranding } from './FooterBranding';
import { FooterLinks } from './FooterLinks';
import { FooterConnect } from './FooterConnect';
import { FooterCopyright } from './FooterCopyright';

export function Footer() {
	return (
		<footer className='bg-foreground text-background py-16'>
			<div className='container mx-auto px-4'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-10'>
					<FooterBranding />
					<FooterLinks />
					<FooterConnect />
				</div>
				<FooterCopyright />
			</div>
		</footer>
	);
}
