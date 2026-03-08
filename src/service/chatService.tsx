import type { ChatApiRes, CurrentMsg, MsgIdxList } from '../const/msg';
import apiFetch from './apiFetch';
import authController from './auth';

async function chat(msg: CurrentMsg) {
	return apiFetch<ChatApiRes<CurrentMsg>>(
		'/auth/chat',
		'POST',
		msg,
		{
			Authorization: `Bearer ${authController.accessToken}`,
		},
		true,
	) as unknown as ReadableStreamDefaultReader<any>;
}

async function createChat() {
	return apiFetch<ChatApiRes<CurrentMsg>>(
		'/auth/chat/createChat',
		'POST',
		{},
		{
			Authorization: `Bearer ${authController.accessToken}`,
		},
	) as unknown as ChatApiRes<CurrentMsg>;
}

async function deleteMsg(id: string) {
	return apiFetch<ChatApiRes<null>>(
		'/auth/chat/delete',
		'POST',
		{ id },
		{
			Authorization: `Bearer ${authController.accessToken}`,
		},
	) as unknown as ChatApiRes<null>;
}

async function changeMsgLabel(id: string, label: string) {
	return apiFetch<ChatApiRes<null>>(
		'/auth/chat/newLabel',
		'POST',
		{ id, label },
		{
			Authorization: `Bearer ${authController.accessToken}`,
		},
	) as unknown as ChatApiRes<null>;
}

async function get(id: string) {
	return authController.afterAuthReady<ChatApiRes<CurrentMsg>>(
		apiFetch,
		'/auth/chat/get',
		'POST',
		{ id },
	) as unknown as ChatApiRes<CurrentMsg>;
}

async function getMsgList() {
	return authController.afterAuthReady<ChatApiRes<CurrentMsg>>(
		apiFetch,
		'/auth/chat/list',
		'POST',
		{},
	) as unknown as ChatApiRes<MsgIdxList>;
}

export { chat, createChat, get, getMsgList, deleteMsg, changeMsgLabel };
