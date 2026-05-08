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

async function hash(str: string) {
	const encoder = new TextEncoder();
	const data = encoder.encode(str);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
	return hashHex;
}

function createImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.setAttribute('crossOrigin', 'anonymous');
		image.src = url;
		image.onload = () => resolve(image);
		image.onerror = reject;
	});
}

async function getCroppedImg(
	imageSrc: string,
	pixelCrop: {
		x: number;
		y: number;
		width: number;
		height: number;
	},
) {
	const image = await createImage(imageSrc);
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	if (!ctx) return null;

	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;

	ctx.drawImage(
		image,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		pixelCrop.width,
		pixelCrop.height,
	);

	return new Promise<Blob | null>((resolve) => {
		canvas.toBlob((file) => {
			resolve(file);
		}, 'image/jpeg');
	});
}

export {
	loginValidate,
	signupValidate,
	getAuthHeader,
	emailLoginValidate,
	hash,
	getCroppedImg,
};
