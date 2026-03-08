export default async function apiFetch<T>(
	endpoint: string,
	method: string = 'GET',
	body?: Record<string, string | boolean | Object>,
	customHeaders?: Record<string, string>,
	stream?: boolean,
): Promise<T | ReadableStreamDefaultReader | undefined> {
	const res = await fetch(apiPrefix + endpoint, {
		method,
		headers: {
			'Content-Type': 'application/json',
			...customHeaders,
		},
		credentials: 'include',
		body: JSON.stringify(body),
	});
	if (stream && res.body) {
		return res.body.getReader();
	}
	return res.json();
}

export type ApiFetch<T> = (
	endpoint: string,
	method?: string,
	body?: Record<string, string | boolean | Object>,
	customHeaders?: Record<string, string>,
	stream?: boolean,
) => Promise<T | ReadableStreamDefaultReader | undefined>;

export type ApiFetchRes<T> = {
	success: boolean;
	msg: string;
	data?: T;
};

export const apiPrefix = import.meta.env.VITE_API_URL + '/api';
