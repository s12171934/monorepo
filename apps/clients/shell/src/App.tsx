import Home from 'home/App';
import { Suspense } from 'react';

export default function App() {
	return (
		<>
			<h1>Shell</h1>
			<Suspense fallback="Loading...">
				<Home />
			</Suspense>
		</>
	);
}
