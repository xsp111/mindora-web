import { hash } from '@/utils';

export default async function apiFetch<T>(
	endpoint: string,
	options: apiFetchOptions<false>,
): Promise<T extends ApiFetchRes<infer U> ? ApiFetchRes<U> : T>;
export default async function apiFetch(
	endpoint: string,
	options: apiFetchOptions<true>,
): Promise<ReadableStreamDefaultReader<Uint8Array>>;
export default async function apiFetch(
	endpoint: string,
	options: apiFetchOptions<boolean>,
) {
	try {
		const { method = 'GET', body, customHeaders, stream } = options;
		if (body && body.hasOwnProperty('password')) {
			// @ts-ignore
			body.password = await hash(body.password);
		}

		const isFormData = body instanceof FormData;
		const finalHeaders = isFormData
			? {
					...customHeaders,
				}
			: {
					...customHeaders,
					'Content-Type': 'application/json',
				};
		const finalBody = isFormData ? body : JSON.stringify(body);

		const res = await fetch(apiPrefix + endpoint, {
			method,
			headers: finalHeaders,
			credentials: 'include',
			body: finalBody,
		});
		if (stream && res.body) {
			return res.body.getReader();
		}
		return await res.json();
	} catch (error) {
		return {
			success: false,
			msg: '请求失败，请检查您的网络',
		};
	}
}

export type ApiFetch<T> = (
	endpoint: string,
	options: apiFetchOptions<boolean>,
) => Promise<T | ReadableStreamDefaultReader | ApiFetchFailRes>;

export type ApiFetchRes<T> = {
	success: boolean;
	msg: string;
	data?: T;
};

export type ApiFetchFailRes = ApiFetchRes<{}>;

export const apiPrefix = `${import.meta.env.DEV ? 'http://localhost:3000' : ''}/api`;

type apiFetchOptions<S> = {
	method?: string;
	body?: Record<string, string | boolean | Object> | FormData;
	customHeaders?: Record<string, string>;
	stream?: S;
};
