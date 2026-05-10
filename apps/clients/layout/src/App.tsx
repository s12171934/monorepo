import Footer from './Footer';
import Header from './Header';

export default function App() {
	return (
		<>
			<Header />
			<h2>Home</h2>
			<a href="http://localhost:8080/api/login">Login with GitHub</a>
			<Footer />
		</>
	);
}
