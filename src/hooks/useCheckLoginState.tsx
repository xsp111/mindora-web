import authController from '@/service/auth';
import { userStore } from '@/store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useStore } from 'zustand';
import useSingleMessageApiCall from './useSingleMessageApiCall';

export default function useCheckLoginState() {
	const isLogin = useStore(userStore, (state) => state.isLogin);
	const setLoginOrSignupModalVisible = useStore(
		userStore,
		(state) => state.setLoginOrSignupModalVisible,
	);
	const navigate = useNavigate();
	const messageApi = useSingleMessageApiCall();

	useEffect(() => {
		authController.auth.then((_) => {
			if (!authController.isLogin) {
				navigate('/');
				setLoginOrSignupModalVisible(true);
				messageApi.warning('登录后体验 Mindora');
			}
		});
	}, []);

	return {
		fallback: isLogin ? null : <></>,
	};
}
