import type { InferEntity } from '@mikro-orm/core';
import {
	type EntityManager,
	type EntityRepository,
	MikroORM,
} from '@mikro-orm/postgresql';
import {
	type DynamicModule,
	Global,
	Inject,
	Module,
	Scope,
} from '@nestjs/common';

import { User } from './entities/user/user.entity.js';
import {
	createRepositoryConfig,
	getRepositoryDatabaseOptionsFromEnv,
	type RepositoryDatabaseOptions,
} from './repository.config.js';

export type UserEntity = InferEntity<typeof User>;
export type UserRepository = EntityRepository<UserEntity>;
export type RepositoryOrm = MikroORM;
export type RepositoryEntityManager = EntityManager;

/** MikroORM 인스턴스 토큰입니다. */
export const REPOSITORY_ORM_TOKEN = Symbol('REPOSITORY_ORM_TOKEN');

/** 요청 단위 EntityManager 토큰입니다. */
export const REPOSITORY_ENTITY_MANAGER_TOKEN = Symbol(
	'REPOSITORY_ENTITY_MANAGER_TOKEN',
);

/** `User` 레포지토리 토큰입니다. */
export const USER_REPOSITORY_TOKEN = Symbol('USER_REPOSITORY_TOKEN');

/** MikroORM 인스턴스를 주입할 때 사용하는 헬퍼입니다. */
export const InjectRepositoryOrm = () => Inject(REPOSITORY_ORM_TOKEN);

/** 요청 단위 EntityManager를 주입할 때 사용하는 헬퍼입니다. */
export const InjectRepositoryEntityManager = () =>
	Inject(REPOSITORY_ENTITY_MANAGER_TOKEN);

/** `User` 레포지토리를 주입할 때 사용하는 헬퍼입니다. */
export const InjectUserRepository = () => Inject(USER_REPOSITORY_TOKEN);

@Global()
@Module({})
export class RepositoryModule {
	static forRoot(options: RepositoryDatabaseOptions = {}): DynamicModule {
		const ormProvider = {
			provide: REPOSITORY_ORM_TOKEN,
			useFactory: async () => MikroORM.init(createRepositoryConfig(options)),
		};

		const entityManagerProvider = {
			provide: REPOSITORY_ENTITY_MANAGER_TOKEN,
			scope: Scope.REQUEST,
			inject: [REPOSITORY_ORM_TOKEN],
			useFactory: (orm: MikroORM) => orm.em.fork(),
		};

		const userRepositoryProvider = {
			provide: USER_REPOSITORY_TOKEN,
			scope: Scope.REQUEST,
			inject: [REPOSITORY_ENTITY_MANAGER_TOKEN],
			useFactory: (em: EntityManager) => em.getRepository(User),
		};

		const ormShutdownProvider = {
			provide: 'REPOSITORY_ORM_SHUTDOWN',
			inject: [REPOSITORY_ORM_TOKEN],
			useFactory: (orm: MikroORM) => ({
				async onApplicationShutdown() {
					await orm.close(true);
				},
			}),
		};

		return {
			module: RepositoryModule,
			providers: [
				ormProvider,
				entityManagerProvider,
				userRepositoryProvider,
				ormShutdownProvider,
			],
			exports: [
				REPOSITORY_ORM_TOKEN,
				REPOSITORY_ENTITY_MANAGER_TOKEN,
				USER_REPOSITORY_TOKEN,
			],
			global: true,
		};
	}

	static forRootFromEnv(env: NodeJS.ProcessEnv = process.env): DynamicModule {
		return RepositoryModule.forRoot(getRepositoryDatabaseOptionsFromEnv(env));
	}
}
