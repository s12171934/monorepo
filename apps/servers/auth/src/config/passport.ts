import passport from 'passport';
import GitHubStrategy, { type Profile } from 'passport-github2';

import type { AppService } from '../app.service';
import { appEnv } from './env';

const { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } = appEnv.GITHUB;

if (!CLIENT_ID || !CLIENT_SECRET || !CALLBACK_URL) {
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
				clientID: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				callbackURL: CALLBACK_URL,
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
