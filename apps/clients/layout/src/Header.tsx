import Profile from './Profile';

export default function Header() {
	return (
		<>
			<h1>Header</h1>
			<a href="http://localhost:8080/api/login">Login with GitHub</a>
			<Profile />
		</>
	);
}
