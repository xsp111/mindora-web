import { Route, Routes, useNavigate } from 'react-router';
import HomePage from './home';
import RootLayout from '@/components/pc/rootLayout';
import CvsCenter from './cvsCenter';
import UserCenter from './userCenter';
import { userStore } from '@/store';
import { useStore } from 'zustand';
import { use, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Empty } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

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
				<Route path='/chat/:conversationId' element={<CvsCenter />} />
				<Route path='/user' element={<UserCenter />} />
				<Route path='*' element={<JumpToDocSite />} />
			</Route>
		</Routes>
	);
}

function JumpToDocSite() {
	const navigate = useNavigate();
	const ref = useRef<HTMLAnchorElement>(null);

	useEffect(() => {
		navigate('/');
		ref.current?.click();
	}, []);

	return (
		<div className='w-full h-full flex items-center justify-center text-[40px]'>
			<a
				ref={ref}
				href=' https://xsp111.github.io/mindora-doc/'
				target='_blank'
			></a>
			<LoadingOutlined />
		</div>
	);
}
