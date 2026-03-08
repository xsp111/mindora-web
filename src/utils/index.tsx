import type { LoginOrSignupInfo } from '../const/user';

function loginValidate(loginInfo: LoginOrSignupInfo): {
	success: boolean;
	msg: string;
} {
	const { name, password } = loginInfo;
	if (!name || !password) {
		return {
			success: false,
			msg: '请输入用户名或密码',
		};
	}
	return {
		success: true,
		msg: '',
	};
}

function emailLoginValidate(email: string): {
	success: boolean;
	msg: string;
} {
	if (!email) {
		return {
			success: false,
			msg: '请输入邮箱',
		};
	}
	if (!email.includes('@')) {
		return {
			success: false,
			msg: '请输入正确的邮箱',
		};
	}
	return {
		success: true,
		msg: '',
	};
}

function signupValidate(signupInfo: LoginOrSignupInfo): {
	success: boolean;
	msg: string;
} {
	const { name, password, confirmPassword } = signupInfo;
	if (!name || !password) {
		return {
			success: false,
			msg: '请填写用户名或密码',
		};
	}
	if (!confirmPassword) {
		return {
			success: false,
			msg: '请确认密码',
		};
	}
	if (name.startsWith(' ')) {
		return {
			success: false,
			msg: '用户名不能以空格开头',
		};
	}
	if (password.length < 6) {
		return {
			success: false,
			msg: '密码长度不能小于6位',
		};
	}
	if (password !== confirmPassword) {
		return {
			success: false,
			msg: '两次密码不一致',
		};
	}
	return {
		success: true,
		msg: '',
	};
}

function getAuthHeader(accessToken: string | undefined): {
	Authorization: string;
} {
	return {
		Authorization: `Bearer ${accessToken}`,
	};
}

export { loginValidate, signupValidate, getAuthHeader, emailLoginValidate };
