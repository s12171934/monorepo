import passport from 'passport';
import GitHubStrategy, { type Profile } from 'passport-github2';

import type { AppService } from '../app.service';

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL } = Bun.env;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !GITHUB_CALLBACK_URL) {
	throw new Error(
		'GitHub OAuth credentials are not set in environment variables.',
	);
}

let isPassportConfigured = false;

export function configurePassport(appService: AppService) {
	if (isPassportConfigured) {
		return;
	}

	passport.use(
		new GitHubStrategy(
			{
				clientID: GITHUB_CLIENT_ID,
				clientSecret: GITHUB_CLIENT_SECRET,
				callbackURL: GITHUB_CALLBACK_URL,
			},
			async (
				_accessToken: string,
				_refreshToken: string,
				profile: Profile,
				done,
			) => {
				try {
					const user = await appService.saveGithubUser(profile);
					done(null, user);
				} catch (error) {
					done(error as Error);
				}
			},
		),
	);

	isPassportConfigured = true;
}
