import type { ApiFetchRes } from '../service/apiFetch';

type User = {
	id: string;
	name: string;
	avatar: string;
	email?: string;
	accessToken?: string;
};

type LoginOrSignupInfo = {
	name: string;
	password: string;
	remember?: boolean;
	confirmPassword?: string;
};

type UserApiRes<T = {}> = ApiFetchRes<User & T>;

export type {
	authGlobal,
	User,
	LoginOrSignupInfo,
	UserApiRes,
	EditUserInfo,
	AuthState,
};
