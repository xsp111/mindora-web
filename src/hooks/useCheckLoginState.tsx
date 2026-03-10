import { messageContext } from '@/components/pc/rootLayout';
import { userStore } from '@/store';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useStore } from 'zustand';

export default function useCheckLoginState() {
	const isLogin = useStore(userStore, (state) => state.isLogin);
	const setLoginOrSignupModalVisible = useStore(
		userStore,
		(state) => state.setLoginOrSignupModalVisible,
	);
	const navigate = useNavigate();
	const messageApi = useContext(messageContext);

	useEffect(() => {
		if (!isLogin) {
			navigate('/');
			setLoginOrSignupModalVisible(true);
			messageApi.warning('登录后体验 Mindora');
		}
	}, [isLogin]);

	return {
		fallback: isLogin ? null : <></>,
	};
}
