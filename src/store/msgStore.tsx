import { create } from 'zustand';
import type { CurrentMsg, Message, MsgIdxList } from '../const/msg';
import type { ApiFetchRes } from '../service/apiFetch';
import { chatService } from '../service';

interface msgState {
	msgIdxList: MsgIdxList;
	id: CurrentMsg['id'];
	label: CurrentMsg['label'];
	msg: CurrentMsg['msg'];
	generating: CurrentMsg['generating'];
	setMsgIdxList: (msgIdxList: MsgIdxList) => void;
	getMsgIdxList: () => Promise<ApiFetchRes<MsgIdxList>>;
	getCurrentMsg: (idx: string) => Promise<ApiFetchRes<CurrentMsg>>;
	deleteMsg: (
		id: string,
	) => Promise<ApiFetchRes<MsgIdxList> & { joinNew?: boolean | undefined }>;
	changeMsgLabel: (
		id: string,
		label: string,
	) => Promise<ApiFetchRes<MsgIdxList>>;
	createMsg: () => Promise<ApiFetchRes<string>>;
	sendMsg: (newMsg: Message) => Promise<ApiFetchRes<CurrentMsg>>;
}

const msgStore = create<msgState>((_set, _get) => ({
	msgIdxList: [],
	id: '0',
	label: '',
	msg: [],
	generating: false,
	setMsgIdxList: (msgIdxList: MsgIdxList) => {
		_set({
			msgIdxList: msgIdxList || [],
		});
	},
	getMsgIdxList: async () => {
		const {
			success,
			msg,
			data: msgIdxList,
		} = await chatService.getMsgList();
		if (!success) {
			return {
				success: false,
				msg: msg,
			};
		}
		_set({
			msgIdxList: msgIdxList || [],
		});
		return {
			success,
			msg,
		};
	},
	getCurrentMsg: async (idx: string) => {
		const { id } = _get();
		history.pushState({}, '', `/start?msg=${idx}`);
		if (idx === '0') {
			_set({
				id: idx,
				label: '',
				msg: [],
			});
			return {
				success: true,
				msg: '',
			};
		}
		// 新建会话场景下， 服务端尚未创建好会话
		if (id === idx) {
			return {
				success: true,
				msg: '',
			};
		}
		const { success, msg, data: resMsg } = await chatService.get(idx);
		if (!success) {
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
	deleteMsg: async (deleteId: string) => {
		const { success, msg } = await chatService.deleteMsg(deleteId);
		if (!success) {
			return {
				success: false,
				msg: msg,
			};
		}
		const { id, msgIdxList } = _get();
		const newMsgIdxList = msgIdxList.filter(
			(item) => item.idx !== deleteId,
		);
		_set({ msgIdxList: newMsgIdxList });
		return {
			success: true,
			msg: '删除成功',
			joinNew: id === deleteId,
		};
	},
	changeMsgLabel: async (id: string, label: string) => {
		const { success, msg } = await chatService.changeMsgLabel(id, label);
		if (!success) {
			return {
				success: false,
				msg: msg,
			};
		}
		const msgIdxList = _get().msgIdxList.map((item) => {
			if (item.idx === id) {
				return {
					...item,
					label,
				};
			}
			return item;
		});
		_set({ msgIdxList });
		return {
			success: true,
			msg: '修改成功',
		};
	},
	createMsg: async () => {
		const { success, msg, data: newMsg } = await chatService.createChat();
		if (!success) {
			return {
				success: false,
				msg: msg,
			};
		}
		history.pushState({}, '', `/start?msg=${newMsg?.id}`);
		_set({
			...newMsg,
			msgIdxList: [
				..._get().msgIdxList,
				{
					idx: newMsg?.id || '',
					label: newMsg?.label || '',
				},
			],
		});
		return {
			success: true,
			msg: '',
		};
	},
	sendMsg: async (newMsg: Message) => {
		const { id, label, msg } = _get();
		_set({
			generating: true,
		});
		const preMsg = {
			id,
			label,
			msg: [
				...msg,
				newMsg,
				{
					role: 'assistant',
					content: '',
					loading: true,
				},
			],
		};
		_set({
			...preMsg,
		});
		const reader = await chatService.chat(preMsg);
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
				msg: [...preMsg.msg.filter((item) => !item.loading), agentMsg],
			});
		}
		_set({
			generating: false,
		});
		return {
			success: true,
			msg: '',
		};
	},
}));

export { msgStore };
