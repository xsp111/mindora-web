import type {
	EditUserInfo,
	LoginOrSignupInfo,
	UserApiRes,
} from '../const/user';
import apiFetch, { type ApiFetchRes } from './apiFetch';

async function login(
	loginOrSignupInfo: LoginOrSignupInfo | {},
): Promise<UserApiRes> {
	return apiFetch<UserApiRes>('/user/login', {
		method: 'POST',
		body: loginOrSignupInfo,
	});
}

async function sendVerifyEmail(email: string): Promise<
	ApiFetchRes<{
		verifyToken: string;
	}>
> {
	return apiFetch<
		UserApiRes<{
			verifyToken: string;
		}>
	>('/user/login/email', {
		method: 'POST',
		body: {
			email,
		},
	});
}

async function signup(
	loginOrSignupInfo: LoginOrSignupInfo,
): Promise<UserApiRes> {
	return apiFetch<UserApiRes>('/user/signup', {
		method: 'POST',
		body: loginOrSignupInfo,
	});
}

async function logout(): Promise<UserApiRes> {
	return apiFetch<UserApiRes>('/user/logout', {
		method: 'POST',
	});
}

async function editUserInfo(editInfo: EditUserInfo): Promise<UserApiRes> {
	return apiFetch<UserApiRes>('/api/user/edit', {
		method: 'POST',
		body: editInfo,
	});
}

export { login, signup, editUserInfo, logout, sendVerifyEmail };
