import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const Root = document.getElementById('root') as HTMLElement;
createRoot(Root).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
