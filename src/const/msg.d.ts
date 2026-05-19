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

type Characteristic = {
	profileSummary: string;
	overview: string;
	emotionTrend7d: Array<{ date: 'YYYY-MM-DD'; valence: number }>;
	dimensions: {
		valence: number;
		arousal: number;
		stress: number;
		cognitive_distortion: number;
		regulation: number;
		risk: number;
	};
	suggestions: Array<string>;
	insights: {
		summary: string;
		keywords: Array<string>;
	};
};

type degree = -1 | 0 | 1;
type UserSettings = {
	reply: {
		style: number;
		gentle: degree;
		passion: degree;
		titleAndList: degree;
		emoji: degree;
		custom: string;
	};
	privacy: {
		nickname: string;
		career: string;
		detail: string;
		useMemory: boolean;
		reset: 0 | 1 | 7 | 30;
	};
};

export type {
	Message,
	ChatApiRes,
	Conversation,
	ConversationMeta,
	ConversationIdxList,
	Characteristic,
	UserSettings,
};
