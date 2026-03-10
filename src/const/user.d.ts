import type { ApiFetchRes } from '../service/apiFetch';

type User = {
	id: string;
	name: string;
	avatar: string;
	accessToken?: string;
};

type LoginOrSignupInfo = {
	name: string;
	password: string;
	remember?: boolean;
	confirmPassword?: string;
};

type UserApiRes<T = {}> = ApiFetchRes<User & T>;

type EditUserInfo = {
	name?: string;
	avatar?: string;
};

export type {
	authGlobal,
	User,
	LoginOrSignupInfo,
	UserApiRes,
	EditUserInfo,
	AuthState,
};
