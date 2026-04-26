import { defineEntity, p } from '@mikro-orm/core';

/**
 * `users` 테이블에 대응하는 엔티티 정의입니다.
 *
 * 이 정의는 데이터베이스 구조와의 연결을 담당하고,
 * 위의 검증 형식은 GitHub Passport에서 받은 사용자 정보와 토큰의 입력 확인을 담당합니다.
 */
export const UserEntity = defineEntity({
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
