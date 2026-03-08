import { create } from 'zustand';
import type {
	User,
	LoginOrSignupInfo,
	EditUserInfo,
	UserApiRes,
	authGlobal,
} from '../const/user';
import { userService } from '../service';
import authController from '../service/auth';
import { apiPrefix, type ApiFetchRes } from '../service/apiFetch';

interface UserState {
	user: User;
	isLogin: boolean;
	loginOrSignupModalVisible: boolean;
	setLoginOrSignupModalVisible: (visible: boolean) => void;
	setUser: (user: User) => void;
	initUser: () => void;
	login: (loginOrSignupInfo: LoginOrSignupInfo) => Promise<UserApiRes>;
	sendVerifyEmail: (
		email: string,
	) => Promise<ApiFetchRes<{ verifyToken: string }>>;
	wait4EmailVerify: (
		verifyToken: string,
		cb: (res: 'success' | 'error' | 'timeout') => void,
	) => void;
	signup: (loginOrSignupInfo: LoginOrSignupInfo) => Promise<UserApiRes>;
	logout: () => Promise<UserApiRes>;
	editUserInfo: (editInfo: EditUserInfo) => Promise<UserApiRes>;
}

const userStore = create<UserState>((_set, _get) => ({
	user: {
		id: '',
		name: '',
		avatar: '',
	},
	isLogin: false,
	loginOrSignupModalVisible: false,
	setLoginOrSignupModalVisible: (visible) =>
		_set({
			loginOrSignupModalVisible: visible,
		}),
	setUser: (user) => _set({ user }),
	initUser: async () => {
		const { success, data } = await authController.auth;
		if (success) {
			_set({
				user: data,
				isLogin: true,
			});
		} else {
			_set({
				loginOrSignupModalVisible: true,
			});
		}
	},
	login: async (loginInfo) => {
		const res = await userService.login(loginInfo);
		if (res.success) {
			authController.accessToken = res.data?.accessToken;
			_set({
				user: res.data,
				isLogin: true,
			});
		}
		return res;
	},
	sendVerifyEmail: async (email) => {
		const res = await userService.sendVerifyEmail(email);
		return res;
	},
	wait4EmailVerify: (verifyToken, cb) => {
		const sse = new EventSource(
			`${apiPrefix}/user/login/email/verify?verifyToken=${verifyToken}`,
		);
		const timer = setTimeout(
			() => {
				cb('timeout');
				clear();
			},
			1000 * 60 * 5,
		);
		function clear() {
			clearTimeout(timer);
			sse.removeEventListener('success', onSuccess);
			sse.removeEventListener('error', onError);
			sse.close();
		}
		const onError = (e: MessageEvent) => {
			console.error(e.data);
			cb('error');
			clear();
		};
		const onSuccess = (e: MessageEvent) => {
			const data = JSON.parse(e.data);
			_set({
				user: {
					id: data.id,
					name: data.name,
					avatar: data.avatar,
				},
				isLogin: true,
				loginOrSignupModalVisible: false,
			});
			cb('success');
			authController.accessToken = data.accessToken;
			clear();
		};
		sse.addEventListener('error', onError);
		sse.addEventListener('success', onSuccess);
	},
	signup: async (signupInfo) => {
		const res = await userService.signup(signupInfo);
		if (res.success) {
			_set({
				user: res.data,
				isLogin: true,
			});
		}
		return res;
	},
	logout: async () => {
		const res = await userService.logout();
		if (res.success) {
			authController.accessToken = undefined;
			_set({
				user: {
					id: '',
					name: '',
					avatar: '',
				},
				isLogin: false,
				loginOrSignupModalVisible: true,
			});
		}
		return res;
	},
	editUserInfo: async (editInfo) => {
		const res = await userService.editUserInfo(editInfo);
		if (res.success) {
			_set({
				user: res.data,
			});
		}
		return res;
	},
}));

export { userStore };
