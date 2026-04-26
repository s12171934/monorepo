import {
	createRepositoryConfig,
	getRepositoryDatabaseOptionsFromEnv,
} from './repository.config.js';

export default createRepositoryConfig(
	getRepositoryDatabaseOptionsFromEnv(process.env),
);
