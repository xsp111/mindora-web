import type { ChatApiRes, CurrentMsg, MsgIdxList } from '../const/msg';
import apiFetch from './apiFetch';
import authController from './auth';

async function chat(msg: CurrentMsg) {
	return apiFetch('/auth/chat', {
		method: 'POST',
		body: msg,
		customHeaders: {
			Authorization: `Bearer ${authController.accessToken}`,
		},
		stream: true,
	});
}

async function createChat() {
	return apiFetch<ChatApiRes<CurrentMsg>>('/auth/chat/createChat', {
		method: 'POST',
		customHeaders: {
			Authorization: `Bearer ${authController.accessToken}`,
		},
	});
}

async function deleteMsg(id: string) {
	return apiFetch<ChatApiRes<null>>('/auth/chat/delete', {
		method: 'POST',
		body: { id },
		customHeaders: {
			Authorization: `Bearer ${authController.accessToken}`,
		},
	});
}

async function changeMsgLabel(id: string, label: string) {
	return apiFetch<ChatApiRes<null>>('/auth/chat/newLabel', {
		method: 'POST',
		body: { id, label },
		customHeaders: {
			Authorization: `Bearer ${authController.accessToken}`,
		},
	});
}

async function get(id: string) {
	return authController.afterAuthReady<ChatApiRes<CurrentMsg>>(
		apiFetch,
		'/auth/chat/get',
		{
			method: 'POST',
			body: { id },
		},
	);
}

async function getMsgList() {
	return authController.afterAuthReady<ChatApiRes<MsgIdxList>>(
		apiFetch,
		'/auth/chat/list',
		{
			method: 'POST',
		},
	);
}

export { chat, createChat, get, getMsgList, deleteMsg, changeMsgLabel };
