import type { ApiFetchRes } from '../service/apiFetch';

type MsgIdxList = {
	idx: string;
	label: string;
}[];

type Message = {
	role: string;
	content: string;
	loading?: boolean;
};

type CurrentMsg = {
	id: string;
	label: string;
	msg: Message[];
	generating?: boolean;
};

type ChatApiRes<T> = ApiFetchRes<T>;

export type { MsgIdxList, Message, CurrentMsg, ChatApiRes };
