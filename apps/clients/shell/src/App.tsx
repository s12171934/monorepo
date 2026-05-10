import Home from 'home/App';
import { Footer, Header } from 'layout/shared';
import { Suspense } from 'react';

export default function App() {
	return (
		<>
			<Suspense fallback="Loading...">
				<Header />
			</Suspense>
			<Suspense fallback="Loading...">
				<Home />
			</Suspense>
			<Suspense fallback="Loading...">
				<Footer />
			</Suspense>
		</>
	);
}
