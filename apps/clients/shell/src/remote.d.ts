declare module 'home/App' {
	import type { ComponentType } from 'react';

	type HomeProps = Record<string, never>;

	const Home: ComponentType<HomeProps>;
	export default Home;
}
