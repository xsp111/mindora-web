import type {
	EditUserInfo,
	LoginOrSignupInfo,
	UserApiRes,
} from '../const/user';
import apiFetch, { type ApiFetchRes } from './apiFetch';

async function login(
	loginOrSignupInfo: LoginOrSignupInfo | {},
): Promise<UserApiRes> {
	return apiFetch<UserApiRes>(
		'/user/login',
		'POST',
		loginOrSignupInfo,
	) as unknown as UserApiRes;
}

async function sendVerifyEmail(email: string): Promise<
	ApiFetchRes<{
		verifyToken: string;
	}>
> {
	return apiFetch<UserApiRes>('/user/login/email', 'POST', {
		email,
	}) as unknown as ApiFetchRes<{
		verifyToken: string;
	}>;
}

async function signup(
	loginOrSignupInfo: LoginOrSignupInfo,
): Promise<UserApiRes> {
	return apiFetch<UserApiRes>(
		'/user/signup',
		'POST',
		loginOrSignupInfo,
	) as unknown as UserApiRes;
}

async function logout(): Promise<UserApiRes> {
	return apiFetch<UserApiRes>(
		'/user/logout',
		'POST',
	) as unknown as UserApiRes;
}

async function editUserInfo(editInfo: EditUserInfo): Promise<UserApiRes> {
	return apiFetch<UserApiRes>(
		'/api/user/edit',
		'POST',
		editInfo,
	) as unknown as UserApiRes;
}

export { login, signup, editUserInfo, logout, sendVerifyEmail };
