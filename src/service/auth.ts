import type { UserApiRes } from '@/const/user';
import type apiFetch from './apiFetch';
import { login } from './user.service';

type AuthController = {
	auth: Promise<UserApiRes>;
	isLogin: boolean;
	accessToken: string | undefined;
	afterAuthReady: <T>(
		cb: typeof apiFetch<T>,
		...args: Parameters<typeof cb>
	) => ReturnType<typeof cb>;
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
	afterAuthReady: (callback, ...args) => {
		return authController.auth.then(() => {
			const { customHeaders, ...rest } = args[1];
			return callback(args[0], {
				...rest,
				customHeaders: {
					...customHeaders,
					Authorization: `Bearer ${authController.accessToken}`,
				},
			});
		});
	},
};

export default authController;
