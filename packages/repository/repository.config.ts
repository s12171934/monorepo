import { Migrator } from '@mikro-orm/migrations';
import { defineConfig, type Options } from '@mikro-orm/postgresql';

import { User } from './entities/user/user.entity.js';

export interface RepositoryDatabaseOptions {
	host?: string;
	port?: number;
	user?: string;
	password?: string;
	dbName?: string;
}

export function getRepositoryDatabaseOptionsFromEnv(
	env: NodeJS.ProcessEnv = process.env,
): RepositoryDatabaseOptions {
	return {
		host: env.POSTGRES_HOST ?? '127.0.0.1',
		port: Number(env.POSTGRES_PORT ?? 5432),
		user: env.POSTGRES_USER ?? 'postgres',
		password: env.POSTGRES_PASSWORD ?? 'postgres',
		dbName: env.POSTGRES_DB ?? 'app',
	};
}

export function createRepositoryConfig(
	options: RepositoryDatabaseOptions = {},
): Options {
	return defineConfig({
		host: options.host ?? '127.0.0.1',
		port: options.port ?? 5432,
		user: options.user ?? 'postgres',
		password: options.password ?? 'postgres',
		dbName: options.dbName ?? 'app',
		entities: [User],
		extensions: [Migrator],
		migrations: {
			path: './migrations',
			pathTs: './migrations',
			glob: '!(*.d).{js,ts,cjs}',
			emit: 'ts',
		},
	});
}
