declare module 'home/App' {
	import type { ComponentType } from 'react';

	type HomeProps = Record<string, never>;

	const Home: ComponentType<HomeProps>;
	export default Home;
}

declare module 'layout/shared' {
	import type { ComponentType } from 'react';

	type Props = Record<string, never>;

	export const Header: ComponentType<Props>;
	export const Footer: ComponentType<Props>;
}
