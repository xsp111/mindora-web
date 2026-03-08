import { Route, Routes } from 'react-router';

export default function H5App() {
	return (
		<Routes>
			<Route
				path='/'
				element={
					<div>
						<h1>H5</h1>
					</div>
				}
			/>
		</Routes>
	);
}
