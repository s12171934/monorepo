import { Injectable } from '@nestjs/common';
import {
	InjectRepositoryOrm,
	type RepositoryOrm,
	User,
	type UserRepository,
} from '@repo/repository';
import type { Profile } from 'passport-github2';

interface SavedGithubUser {
	id: string;
	githubId: string;
	username: string;
	displayName: string;
	profileUrl: string | null;
	photos: Array<Record<string, unknown>>;
}

@Injectable()
export class AppService {
	constructor(
		@InjectRepositoryOrm()
		private readonly orm: RepositoryOrm,
	) {}

	async saveGithubUser(profile: Profile): Promise<SavedGithubUser> {
		const em = this.orm.em.fork();
		const userRepository = em.getRepository(User) as UserRepository;
		const photos = Array.isArray(profile.photos)
			? (profile.photos as Array<Record<string, unknown>>)
			: [];

		const user = await userRepository.upsert({
			githubId: String(profile.id),
			username: profile.username ?? String(profile.id),
			displayName:
				profile.displayName ?? profile.username ?? String(profile.id),
		}, {
			onConflictFields: ['githubId'],
			onConflictAction: 'merge',
		});

		await em.flush();

		return {
			id: String(user.id),
			githubId: user.githubId,
			username: user.username,
			displayName: user.displayName,
			profileUrl: profile.profileUrl ?? null,
			photos,
		};
	}
}
