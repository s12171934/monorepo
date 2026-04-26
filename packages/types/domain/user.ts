import z from 'zod';

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

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
