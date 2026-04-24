import { create } from 'zustand';
import type {
	User,
	LoginOrSignupInfo,
	EditUserInfo,
	UserApiRes,
} from '../const/user';
import { chatService, userService } from '../service';
import authController from '../service/auth';
import { apiPrefix, type ApiFetchRes } from '../service/apiFetch';
import type { characteristic } from '@/const/msg';

interface UserState {
	user: User;
	isLogin: boolean;

	characteristic: {
		profileSummary: string;
		overview: string;
		emotionTrend7d: Array<{ date: 'YYYY-MM-DD'; valence: number }>;
		dimensions: {
			valence: number;
			arousal: number;
			stress: number;
			cognitive_distortion: number;
			regulation: number;
			risk: number;
		};
		suggestions: Array<string>;
		insights: {
			summary: string;
			keywords: Array<string>;
		};
	};

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
	logout: (cb: () => void) => Promise<UserApiRes>;
	editUserInfo: (editInfo: EditUserInfo) => Promise<UserApiRes>;
	getCharacteristic: () => Promise<void>;
}

const userStore = create<UserState>((_set, _get) => ({
	user: {
		id: '',
		name: '',
		avatar: '',
	},
	characteristic: {
		profileSummary: '',
		overview: '',
		emotionTrend7d: [],
		dimensions: {
			valence: -1,
			arousal: -1,
			stress: -1,
			cognitive_distortion: -1,
			regulation: -1,
			risk: -1,
		},
		suggestions: [],
		insights: {
			summary: '',
			keywords: [],
		},
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
			authController.isLogin = true;
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
			authController.isLogin = true;
			clear();
		};
		sse.addEventListener('error', onError);
		sse.addEventListener('success', onSuccess);
	},
	signup: async (signupInfo) => {
		const res = await userService.signup(signupInfo);
		if (res.success) {
			res.data?.accessToken &&
				(authController.accessToken = res.data.accessToken);
			authController.isLogin = true;
			_set({
				user: res.data,
				isLogin: true,
			});
		}
		return res;
	},
	logout: async (cb) => {
		const res = await userService.logout();
		if (res.success) {
			authController.accessToken = undefined;
			authController.isLogin = false;
			_set({
				user: {
					id: '',
					name: '',
					avatar: '',
				},
				isLogin: false,
				loginOrSignupModalVisible: true,
			});
			cb();
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
	getCharacteristic: async () => {
		const { success, data: characteristic } =
			await chatService.getCharacteristic();
		if (success) {
			_set({
				characteristic: characteristic as characteristic,
			});
		}
	},
}));

export { userStore };
