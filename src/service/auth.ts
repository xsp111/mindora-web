import type { ApiFetch } from './apiFetch';
import { login } from './userService';

type AuthController = {
	auth: Promise<any>;
	accessToken: string | undefined;
	afterAuthReady: <T>(
		cb: ApiFetch<T>,
		...args: Parameters<typeof cb>
	) => ReturnType<typeof cb>;
};

const authController: AuthController = {
	accessToken: undefined,
	auth: new Promise((resolve) => {
		login({}).then((res) => {
			const { data } = res;
			authController.accessToken = data?.accessToken;
			resolve(res);
		});
	}),
	afterAuthReady: (callback, ...args) => {
		return authController.auth.then(() => {
			// @ts-ignore
			return callback(...args, {
				Authorization: `Bearer ${authController.accessToken}`,
			});
		});
	},
};

export default authController;
