import { useStore } from 'zustand';
import { conversationStore, userStore } from '@/store';
import { Popover } from 'antd';
import DefaultButton from '../common/defaultButton';
import logoutIcon from '@/assets/logout.svg';
import { NEW_CONVERSATION } from '@/store/conversation.store';
import { useNavigate } from 'react-router';
import useSingleMessageApiCall from '@/hooks/useSingleMessageApiCall';

export default function NavUserArea() {
	const { user, logout } = useStore(userStore);
	const { getConversation, setConversationIdxList } =
		useStore(conversationStore);
	const messageApi = useSingleMessageApiCall();
	const navigate = useNavigate();
	async function handleLogout() {
		const res = await logout(() => {
			navigate('/');
		});
		if (res.success) {
			messageApi.success(res.msg);
			getConversation(NEW_CONVERSATION);
			setConversationIdxList([]);
		} else {
			messageApi.error(res.msg);
		}
	}

	return (
		<div className='flex justify-center items-center gap-2'>
			<span className='text-gray-700 font-bold text-lg'>你好！</span>
			<Popover
				styles={{
					root: {
						width: 225,
					},
				}}
				arrow={false}
				placement='bottomRight'
				content={
					<div className='flex flex-col items-center gap-4'>
						<span className='w-full text-gray-900 font-bold text-lg'>
							Hi！{user.name}
						</span>
						<DefaultButton
							className='w-full bg-gray-100  border-none hover:bg-gray-50'
							onClick={handleLogout}
						>
							<div className='w-full flex justify-center items-center gap-2'>
								<img src={logoutIcon} width={16} />
								<span className='text-gray-500'>退出登录</span>
							</div>
						</DefaultButton>
					</div>
				}
			>
				<img src={user.avatar} width={32} />
			</Popover>
		</div>
	);
}
