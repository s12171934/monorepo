import { defineEntity, p } from '@mikro-orm/core';
import { z } from 'zod';

/** 데이터베이스에 저장된 사용자 정보 전체를 표현하는 검증 형식입니다. */
export const userSchema = z.object({
	id: z.coerce.bigint(),
	username: z.string().trim().min(1).max(39),
	displayName: z.string().trim().min(1).max(100),
	githubId: z.string().trim().min(1).max(50),
	createdAt: z.date(),
	updatedAt: z.date(),
});

/** 외부에서 사용자 정보를 새로 만들 때 필요한 입력 형식입니다. */
export const createUserSchema = userSchema.omit({
	createdAt: true,
	updatedAt: true,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UserModel = z.infer<typeof userSchema>;

/**
 * `users` 테이블에 대응하는 엔티티 정의입니다.
 *
 * 이 정의는 데이터베이스 구조와의 연결을 담당하고,
 * 위의 검증 형식은 GitHub Passport에서 받은 사용자 정보와 토큰의 입력 확인을 담당합니다.
 */
export const User = defineEntity({
	name: 'User',
	tableName: 'users',
	properties: {
		id: p.bigint().primary().autoincrement(),
		username: p.string().length(39),
		displayName: p.string().length(100),
		githubId: p.string().length(50).unique(),
		createdAt: p.datetime().onCreate(() => new Date()),
		updatedAt: p
			.datetime()
			.onCreate(() => new Date())
			.onUpdate(() => new Date()),
	},
});
