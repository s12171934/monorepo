import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const skipInitial = args.includes('--skip-initial');
const projectPath = args.find((argument) => !argument.startsWith('--'));
const root = resolve(process.cwd(), projectPath ?? '.');
const watchedRoot = resolve(root, 'src');
const watchedFiles = [resolve(root, 'vite.config.ts')].filter(existsSync);

let building = false;
let queuedReason: string | null = null;
let lastSnapshot = snapshot();

function listFiles(directory: string): string[] {
	if (!existsSync(directory)) {
		return [];
	}

	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = join(directory, entry.name);

		return entry.isDirectory() ? listFiles(path) : [path];
	});
}

function snapshot() {
	return new Map(
		[...listFiles(watchedRoot), ...watchedFiles].map((path) => [
			path,
			statSync(path).mtimeMs,
		]),
	);
}

function findChangedFile(
	previous: Map<string, number>,
	next: Map<string, number>,
) {
	for (const [path, mtime] of next) {
		if (previous.get(path) !== mtime) {
			return path;
		}
	}

	for (const path of previous.keys()) {
		if (!next.has(path)) {
			return path;
		}
	}

	return null;
}

async function build(reason: string) {
	if (building) {
		queuedReason = reason;
		return;
	}

	building = true;
	console.log(`[watch-build] build started: ${reason}`);

	const buildProcess = Bun.spawn(['bun', 'run', 'build'], {
		cwd: root,
		stdout: 'inherit',
		stderr: 'inherit',
	});

	const exitCode = await buildProcess.exited;
	console.log(`[watch-build] build ${exitCode === 0 ? 'finished' : 'failed'}`);
	building = false;

	if (queuedReason) {
		const queued = queuedReason;
		queuedReason = null;
		await build(`queued change: ${queued}`);
	}
}

function schedule(reason: string) {
	void build(reason);
}

setInterval(() => {
	const nextSnapshot = snapshot();
	const changed = findChangedFile(lastSnapshot, nextSnapshot);

	if (!changed) {
		return;
	}

	lastSnapshot = nextSnapshot;
	schedule(changed.replace(`${root}/`, ''));
}, 300);

console.log(`[watch-build] watching ${root}`);

if (!skipInitial) {
	schedule('initial');
}
