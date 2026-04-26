import z from 'zod';

const envSchema = z.object({
	PORT: z.coerce.number().int().positive(),
	AUTH_SERVER_URL: z.url(),
});

type Env = z.infer<typeof envSchema>;

const appEnv: Env = {
	PORT: Number(Bun.env.PORT),
	AUTH_SERVER_URL: Bun.env.AUTH_SERVER_URL!,
};

const envVerifyCheck = () => {
	const appEnvVerifyResult = envSchema.safeParse(appEnv);

	if (!appEnvVerifyResult.success) {
		console.error('환경 변수 검증 실패:', appEnvVerifyResult.error);
		process.exit(1);
	}
};

envVerifyCheck();

export { appEnv };
