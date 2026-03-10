import { create } from 'zustand';

import type { ApiFetchRes } from '../service/apiFetch';
import { chatService } from '../service';
import type {
	Conversation,
	ConversationIdxList,
	ConversationMeta,
	Message,
} from '@/const/msg';

interface ConversationStore {
	conversationIdxList: ConversationIdxList;
	// new schema
	meta: ConversationMeta;
	content: Message[];
	// methods
	setConversationIdxList: (conversationIdxList: ConversationIdxList) => void;
	getConversationIdxList: () => Promise<ApiFetchRes<ConversationIdxList>>;
	getConversation: (
		searchConversationId: ConversationMeta['id'],
	) => Promise<ApiFetchRes<Conversation>>;
	deleteConversation: (
		id: ConversationMeta['id'],
	) => Promise<
		ApiFetchRes<ConversationIdxList> & { joinNew?: boolean | undefined }
	>;
	changeConversationLabel: (
		id: ConversationMeta['id'],
		label: ConversationMeta['label'],
	) => Promise<ApiFetchRes<ConversationIdxList>>;
	createConversation: () => Promise<ApiFetchRes<string>>;
	sendMsg: (newMsg: Message) => Promise<ApiFetchRes<Conversation>>;
}

export const NEW_CONVERSATION = '0';

const msgStore = create<ConversationStore>((_set, _get) => ({
	conversationIdxList: [],
	// new schema
	meta: {
		id: NEW_CONVERSATION,
		label: '',
		generating: false,
	},
	content: [],
	setConversationIdxList: (conversationIdxList: ConversationIdxList) => {
		_set({
			conversationIdxList: conversationIdxList || [],
		});
	},
	getConversationIdxList: async () => {
		const {
			success,
			msg,
			data: conversationIdxList,
		} = await chatService.getConversationList();
		if (!success) {
			return {
				success: false,
				msg: msg,
			};
		}
		_set({
			conversationIdxList: conversationIdxList || [],
		});
		return {
			success,
			msg,
		};
	},
	getConversation: async (searchConversationId: string) => {
		const {
			meta: { id: currentConversationId },
		} = _get();
		if (searchConversationId === NEW_CONVERSATION) {
			_set({
				meta: {
					id: searchConversationId,
					label: '',
					generating: false,
				},
				content: [],
			});
			return {
				success: true,
				msg: '',
			};
		}
		// 新建会话场景下， 服务端尚未创建好会话
		if (currentConversationId === searchConversationId) {
			return {
				success: true,
				msg: '',
			};
		}
		const {
			success,
			msg,
			data: resMsg,
		} = await chatService.getConversation(searchConversationId);
		if (!success) {
			console.error(msg);
			return {
				success: false,
				msg: '未找到该对话',
			};
		}
		_set({
			...resMsg,
		});
		return {
			success: true,
			msg: '',
		};
	},
	deleteConversation: async (deleteId: ConversationMeta['id']) => {
		const { success, msg } = await chatService.deleteConversation(deleteId);
		if (!success) {
			return {
				success: false,
				msg: msg,
			};
		}
		const {
			meta: { id },
			conversationIdxList,
		} = _get();
		const newMsgIdxList = conversationIdxList.filter(
			(item) => item.idx !== deleteId,
		);
		_set({
			conversationIdxList: newMsgIdxList,
		});
		return {
			success: true,
			msg: '删除成功',
			joinNew: id === deleteId,
		};
	},
	changeConversationLabel: async (
		id: ConversationMeta['id'],
		label: ConversationMeta['label'],
	) => {
		const { success, msg } = await chatService.changeConversationLabel(
			id,
			label,
		);
		if (!success) {
			return {
				success: false,
				msg: msg,
			};
		}
		const conversationIdxList = _get().conversationIdxList.map((item) => {
			if (item.idx === id) {
				return {
					...item,
					label,
				};
			}
			return item;
		});
		_set({ conversationIdxList });
		return {
			success: true,
			msg: '修改成功',
		};
	},
	createConversation: async () => {
		const {
			success,
			msg,
			data: newConversation,
		} = await chatService.createChat();
		if (!success) {
			return {
				success: false,
				msg: msg,
			};
		}
		// 新会话修改 url
		history.pushState({}, '', `/chat/${newConversation?.meta?.id}`);
		_set({
			meta: {
				id: newConversation?.meta?.id || '',
				label: newConversation?.meta?.label || '',
				generating: false,
			},
			content: [],
			conversationIdxList: [
				..._get().conversationIdxList,
				{
					idx: newConversation?.meta?.id || '',
					label: newConversation?.meta?.label || '',
				},
			],
		});
		return {
			success: true,
			msg: '',
		};
	},
	sendMsg: async (newMsg: Message) => {
		const { meta, content } = _get();
		const preConversation = {
			meta: {
				...meta,
				generating: true,
			},
			content: [...content, newMsg],
		};
		_set({
			...preConversation,
		});
		const reader = await chatService.chat(preConversation);
		let answerContent = '';
		while (true) {
			const { done, value } = await (
				reader as ReadableStreamDefaultReader
			).read();
			if (done) {
				break;
			}
			const chunk = new TextDecoder().decode(value);
			answerContent += chunk;
			const agentMsg: Message = {
				role: 'assistant',
				content: answerContent,
			};

			_set({
				content: [
					...preConversation.content.filter((item) => !item.loading),
					agentMsg,
				],
			});
		}
		_set({
			meta: {
				..._get().meta,
				generating: false,
			},
		});
		return {
			success: true,
			msg: '',
		};
	},
}));

export { msgStore };
