import type { ApiFetchRes } from '../service/apiFetch';

type Message = {
	role: string;
	content: string;
	loading?: boolean;
};

type ChatApiRes<T> = ApiFetchRes<T>;

type Conversation = {
	meta: ConversationMeta;
	content: Message[];
};

type ConversationMeta = {
	id: string;
	label: string;
	generating?: boolean;
};

type ConversationIdxList = {
	idx: ConversationMeta['id'];
	label: ConversationMeta['label'];
}[];

export type {
	Message,
	ChatApiRes,
	Conversation,
	ConversationMeta,
	ConversationIdxList,
};
