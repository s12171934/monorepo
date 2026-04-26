import { Controller, Get, Next, Req, Res } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import passport from 'passport';

function serializeUserCookie(user: Express.User) {
	const profile = user as Record<string, unknown>;
	const photos = Array.isArray(profile.photos)
		? (profile.photos as Array<Record<string, unknown>>)
		: [];

	return JSON.stringify({
		id: profile.id == null ? null : String(profile.id),
		username: profile.username,
		displayName: profile.displayName,
		profileUrl: profile.profileUrl,
		avatarUrl: photos[0]?.value ?? null,
	});
}

@Controller()
export class AppController {
	@Get('api/login')
	login(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
		console.log('Login route accessed');
		return passport.authenticate('github', { scope: ['user:email'] })(
			req,
			res,
			next,
		);
	}

	@Get('api/login/github/callback')
	githubLoginCallback(
		@Req() req: Request,
		@Res() res: Response,
		@Next() next: NextFunction,
	) {
		console.log('GitHub login callback received');
		const clientUrl = Bun.env.CLIENT_URL ?? 'http://localhost:3000';

		return passport.authenticate(
			'github',
			{ failureRedirect: '/api/login', session: false },
			(error: unknown, user: Express.User | false | null) => {
				if (error || !user) {
					console.error('Authentication failed:', error);
					return res.redirect('/api/login');
				}

				res.cookie('user', serializeUserCookie(user), {
					httpOnly: false,
					sameSite: 'lax',
					secure: Bun.env.NODE_ENV === 'production',
					path: '/',
					maxAge: 1000 * 60 * 60 * 24,
				});

				res.redirect(clientUrl);
			},
		)(req, res, next);
	}
}
