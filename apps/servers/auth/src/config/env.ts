import z from 'zod';

const envSchema = z.object({
	NAME: z.enum(['dev', 'prod', 'test']),
	PORT: z.coerce.number().int().positive(),
	CLIENT_URL: z.url(),
	GATEWAY_SERVER_URL: z.url(),
	GITHUB: z.object({
		CLIENT_ID: z.string(),
		CLIENT_SECRET: z.string(),
		CALLBACK_URL: z.url(),
	}),
});

type Env = z.infer<typeof envSchema>;

const appEnv: Env = {
	NAME: (Bun.env.NAME as Env['NAME']) || 'dev',
	PORT: Number(Bun.env.PORT),
	GATEWAY_SERVER_URL: Bun.env.GATEWAY_SERVER_URL!,
	CLIENT_URL: Bun.env.CLIENT_URL!,
	GITHUB: {
		CLIENT_ID: Bun.env.GITHUB_CLIENT_ID!,
		CLIENT_SECRET: Bun.env.GITHUB_CLIENT_SECRET!,
		CALLBACK_URL: `${Bun.env.GATEWAY_SERVER_URL!}/api/login/github/callback`,
	},
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
