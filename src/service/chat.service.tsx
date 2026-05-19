import type {
	Characteristic,
	ChatApiRes,
	Conversation,
	ConversationIdxList,
	UserSettings,
} from '../const/msg';
import apiFetch from './apiFetch';
import authController from './auth';

async function chat({
	conversationId,
	content,
}: {
	conversationId: string;
	content: string;
}) {
	return apiFetch('/auth/chat', {
		method: 'POST',
		body: { conversationId, content },
		customHeaders: {
			Authorization: `Bearer ${authController.accessToken}`,
		},
		stream: true,
	});
}

async function createChat() {
	return apiFetch<ChatApiRes<Conversation>>('/auth/chat/createChat', {
		method: 'POST',
		customHeaders: {
			Authorization: `Bearer ${authController.accessToken}`,
		},
	});
}

async function deleteConversation(id: string) {
	return apiFetch<ChatApiRes<null>>('/auth/chat/delete', {
		method: 'POST',
		body: { id },
		customHeaders: {
			Authorization: `Bearer ${authController.accessToken}`,
		},
	});
}

async function changeConversationLabel(id: string, label: string) {
	return apiFetch<ChatApiRes<null>>('/auth/chat/newLabel', {
		method: 'POST',
		body: { id, label },
		customHeaders: {
			Authorization: `Bearer ${authController.accessToken}`,
		},
	});
}

async function getConversation(id: string) {
	return authController.afterAuthReady<ChatApiRes<Conversation>>(
		apiFetch,
		'/auth/chat/get',
		{
			method: 'POST',
			body: { id },
		},
	);
}

async function getConversationList() {
	return authController.afterAuthReady<ChatApiRes<ConversationIdxList>>(
		apiFetch,
		'/auth/chat/list',
		{
			method: 'POST',
		},
	);
}

async function getCharacteristic() {
	return authController.afterAuthReady<ChatApiRes<Characteristic>>(
		apiFetch,
		'/auth/chat/profile',
		{
			method: 'GET',
		},
	);
}

async function getSettings(settingsPart: keyof UserSettings) {
	return authController.afterAuthReady<
		ChatApiRes<UserSettings[keyof UserSettings]>
	>(apiFetch, `/auth/chat/settings?part=${settingsPart}`, {
		method: 'GET',
	});
}

async function setSettings({
	settingsPart,
	settings,
}: {
	settingsPart: keyof UserSettings;
	settings: UserSettings[keyof UserSettings];
}) {
	return authController.afterAuthReady<
		ChatApiRes<UserSettings[typeof settingsPart]>
	>(apiFetch, `/auth/chat/update-settings?part=${settingsPart}`, {
		method: 'POST',
		body: settings,
	});
}

export {
	chat,
	createChat,
	getConversation,
	getConversationList,
	deleteConversation,
	changeConversationLabel,
	getCharacteristic,
	getSettings,
	setSettings,
};
