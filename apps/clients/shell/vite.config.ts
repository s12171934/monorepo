import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

type RemoteManifest = {
	remote: Record<
		string,
		{
			url: string;
			scope: string;
			module: string;
		}
	>;
};

const manifestPath = resolve(__dirname, 'manifest/manifest.json');
const manifest = JSON.parse(
	readFileSync(manifestPath, 'utf-8'),
) as RemoteManifest;

const remotes = Object.fromEntries(
	Object.entries(manifest.remote).map(([key, remote]) => [
		key,
		`${remote.url}/assets/remoteEntry.js`,
	]),
);

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		federation({
			name: 'shell',
			remotes,
			shared: ['react', 'react-dom'],
		}),
	],
	build: {
		modulePreload: false,
		target: 'esnext',
		minify: false,
		cssCodeSplit: false,
	},
});
