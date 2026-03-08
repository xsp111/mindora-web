import { Route, Routes } from 'react-router';
import HomePage from './home';
import RootLayout from '../../components/pc/rootLayout';
import CvsCenter from './cvsCenter';
import UserCenter from './userCenter';
import { userStore } from '../../store';
import { useStore } from 'zustand';
import { useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function PcApp() {
	const { initUser } = useStore(userStore);

	useEffect(() => {
		initUser();
	}, []);

	return (
		<Routes>
			<Route element={<RootLayout />}>
				<Route index element={<HomePage />} />
				<Route path='/start' element={<CvsCenter />} />
				<Route path='/user' element={<UserCenter />} />
			</Route>
		</Routes>
	);
}
