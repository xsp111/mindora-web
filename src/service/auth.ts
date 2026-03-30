import type { UserApiRes } from '@/const/user';
import type apiFetch from './apiFetch';
import { login } from './user.service';
import type { ApiFetchFailRes } from './apiFetch';

type AuthController = {
	auth: Promise<UserApiRes>;
	isLogin: boolean;
	accessToken: string | undefined;
	afterAuthReady: <T>(
		cb: typeof apiFetch<T>,
		...args: Parameters<typeof cb>
	) => ReturnType<typeof cb> extends Promise<infer U>
		? Promise<U | ApiFetchFailRes>
		: never;
};

const authController: AuthController = {
	accessToken: undefined,
	isLogin: false,
	auth: new Promise((resolve) => {
		login({}).then((res) => {
			const { success, data } = res;
			authController.accessToken = data?.accessToken;
			if (success) authController.isLogin = true;
			resolve(res);
		});
	}),
	afterAuthReady: async (callback, ...args) => {
		const res = await authController.auth;
		const { success } = res;
		if (!success) {
			return {
				success: false,
				msg: '未登录',
			};
		}
		const { customHeaders, ...rest } = args[1];
		return callback(args[0], {
			...rest,
			customHeaders: {
				...customHeaders,
				Authorization: `Bearer ${authController.accessToken}`,
			},
		});
	},
};

export default authController;
