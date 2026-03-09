import { useStore } from 'zustand';
import { msgStore, userStore } from '@/store';
import { Popover } from 'antd';
import DefaultButton from './defaultButton';
import { useContext } from 'react';
import { messageContext } from './rootLayout';
import logoutIcon from '@/assets/logout.svg';

export default function NavUserArea() {
	const { user, logout } = useStore(userStore);
	const { getCurrentMsg, setMsgIdxList } = useStore(msgStore);
	const messageApi = useContext(messageContext);
	async function handleLogout() {
		const res = await logout();
		if (res.success) {
			messageApi.success(res.msg);
			getCurrentMsg('0');
			setMsgIdxList([]);
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
