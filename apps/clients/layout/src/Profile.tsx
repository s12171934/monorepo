import type { UserProfile } from '@repo/types';
import { useEffect, useState } from 'react';

export default function Profile() {
	const [user, setUser] = useState<UserProfile>();

	useEffect(() => {
		const userCookie = document.cookie
			.split('; ')
			.find((cookie) => cookie.startsWith('user='))
			?.split('=')[1];

		if (!userCookie) {
			return;
		}

		const userInfo = JSON.parse(decodeURIComponent(userCookie!));
		console.log(userInfo);
		setUser(userInfo);
	}, []);

	return (
		<>
			{user?.avatarUrl && <img src={user.avatarUrl} alt="profile-img" />}
			{user?.displayName && <h1>{user.displayName}</h1>}
			{user?.profileUrl && <a href={user.profileUrl}>{user.username}</a>}
		</>
	);
}
