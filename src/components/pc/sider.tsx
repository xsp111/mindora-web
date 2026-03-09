import { useContext, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import sidebarColIcon from '@/assets/sidebarCol.svg';
import sidebarColOpenIcon from '@/assets/sidebarColOpen.svg';
import sidebarNewIcon from '@/assets/sidebarNew.svg';
import sidebarHistoryIcon from '@/assets/sidebar.history.svg';
import { useStore } from 'zustand';
import { msgStore, userStore } from '@/store';
import { EllipsisOutlined, LoadingOutlined } from '@ant-design/icons';
import { Input, Modal, Popover } from 'antd';
import { messageContext } from './rootLayout';
import type { ApiFetchRes } from '@/service/apiFetch';
import type { MsgIdxList } from '@/const/msg';

function SiderItem({
	icon,
	text,
	onClick,
}: {
	icon: string | null;
	text: string;
	onClick: (() => void) | undefined;
}) {
	const generating = useStore(msgStore, (state) => state.generating);

	return (
		<div
			className={`h-8 w-full pl-1.5 flex gap-4 ${
				onClick ? 'hover:bg-gray-200 rounded-sm' : ''
			} ${
				generating
					? 'hover:cursor-not-allowed'
					: 'hover:cursor-pointer '
			}`}
			onClick={() => {
				if (generating) {
					return;
				}
				onClick?.();
			}}
		>
			{icon && <img src={icon} width={24} alt='' />}
			<div className='relative w-full'>
				<span className='textCol absolute top-1/2 left-0 -translate-y-1/2 w-18 block font-bold'>
					{text}
				</span>
			</div>
		</div>
	);
}

function SiderSubItem({
	id,
	text,
	gotoMsg,
}: {
	id: string;
	text: string;
	gotoMsg: (id: string) => void;
}) {
	const currentId = useStore(msgStore, (state) => state.id);
	const generating = useStore(msgStore, (state) => state.generating);
	const isActive = currentId === id;
	const [operaAreaVisible, setOperaAreaVisible] = useState(false);
	const [modifyModalInfo, setModifyModalInfo] = useState<
		'unvisible' | 'modify' | 'delete'
	>('unvisible');
	const [loading, setLoading] = useState(false);
	const messageApi = useContext(messageContext);
	const { changeMsgLabel, deleteMsg } = useStore(msgStore);
	const [newLabel, setNewLabel] = useState(text);

	async function handleOk() {
		setLoading(true);
		let res: ApiFetchRes<MsgIdxList> & { joinNew?: boolean | undefined } = {
			success: false,
			msg: '',
		};
		switch (modifyModalInfo) {
			case 'modify':
				{
					res = await changeMsgLabel(id, newLabel);
				}
				break;
			case 'delete':
				{
					res = await deleteMsg(id);
				}
				break;
		}
		const { success, msg, joinNew } = res;
		if (success) {
			messageApi.success(msg);
		} else {
			messageApi.error(msg);
		}
		setLoading(false);
		if (joinNew) {
			gotoMsg('0');
		}
		setModifyModalInfo('unvisible');
	}

	return (
		<>
			<div
				onClick={() => {
					if (generating) {
						return;
					}
					gotoMsg(id);
				}}
				className={`w-full py-1 px-12 flex justify-between items-center gap-4 hover:bg-gray-200  rounded-sm ${
					generating
						? 'hover:cursor-not-allowed'
						: 'hover:cursor-pointer'
				} ${isActive ? 'bg-gray-200' : ''}
					`}
			>
				<span
					className={`block w-full text-sm font-bold text-gray-500 truncate `}
				>
					{text}
				</span>
				<div
					onClick={(e) => {
						e.stopPropagation();
						setOperaAreaVisible(!operaAreaVisible);
					}}
				>
					{generating && isActive ? (
						<LoadingOutlined />
					) : (
						<Popover
							open={operaAreaVisible}
							onOpenChange={setOperaAreaVisible}
							destroyOnHidden={true}
							arrow={false}
							styles={{
								root: {
									width: 100,
								},
							}}
							trigger='click'
							placement='bottom'
							content={
								<div className='flex flex-col items-center gap-2 text-center text-sm font-bold text-gray-500'>
									<span
										className='w-full rounded-sm hover:bg-gray-200 hover:cursor-pointer'
										onClick={() => {
											setModifyModalInfo('modify');
										}}
									>
										修改名称
									</span>
									<span
										className='w-full rounded-sm hover:bg-[#CA8888] hover:text-white hover:cursor-pointer '
										onClick={() => {
											setModifyModalInfo('delete');
										}}
									>
										删除
									</span>
								</div>
							}
						>
							<EllipsisOutlined style={{ fontSize: 20 }} />
						</Popover>
					)}
				</div>
			</div>
			<Modal
				open={modifyModalInfo !== 'unvisible'}
				centered
				destroyOnHidden={true}
				onCancel={() => {
					setModifyModalInfo('unvisible');
				}}
				onOk={handleOk}
				okText={'确认'}
				cancelText={'取消'}
				closable={false}
				confirmLoading={loading}
			>
				{modifyModalInfo === 'modify' ? (
					<div className='flex items-center gap-2'>
						<span className=' text-lg font-bold text-gray-500'>
							新名称：
						</span>
						<Input
							value={newLabel}
							onChange={(e) => setNewLabel(e.target.value)}
							type='text'
							className='flex-1 h-8 px-2 border border-gray-300 rounded-sm'
						/>
					</div>
				) : (
					<div>
						<span className='text-lg font-bold'>
							确定删除会话：{text}嘛？删除后将无法恢复。
						</span>
					</div>
				)}
			</Modal>
		</>
	);
}

export default function Sider() {
	const { user } = useStore(userStore);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const msgIdxList = useStore(msgStore, (state) => state.msgIdxList);
	const getCurrentMsg = useStore(msgStore, (state) => state.getCurrentMsg);
	const getMsgIdxList = useStore(msgStore, (state) => state.getMsgIdxList);

	useEffect(() => {
		if (!user) {
			return;
		}
		getMsgIdxList();
	}, [user]);

	const SiderConfig = [
		{
			icon: null,
			text: '开始',
		},
		{
			icon: sidebarNewIcon,
			text: '新的聊天',
			onClick: () => {
				getCurrentMsg('0');
			},
		},
		{
			icon: sidebarHistoryIcon,
			text: '历史聊天',
			onClick: () => {},
		},
	];

	useGSAP(() => {
		gsap.to('.sider', {
			width: isCollapsed ? 64 : 260,
			duration: 0.3,
		});
		gsap.to('.textCol', {
			color: isCollapsed ? 'transparent' : '#4a5565',
			duration: 0.3,
		});
	}, [isCollapsed]);

	return (
		<div
			className={`sider relative h-full w-[260px]
				p-4 rounded-r-xl bg-gray-50 flex flex-col gap-4 overflow-hidden`}
		>
			<div
				className='absolute z-10 w-8 h-8 top-4 right-4 flex justify-center items-center hover:cursor-pointer'
				onClick={() => setIsCollapsed(!isCollapsed)}
			>
				{isCollapsed ? (
					<img src={sidebarColOpenIcon} width={20} alt='' />
				) : (
					<img src={sidebarColIcon} width={20} alt='' />
				)}
			</div>
			{SiderConfig.map((item) => (
				<SiderItem
					key={item.text}
					icon={item.icon}
					text={item.text}
					onClick={item.onClick}
				/>
			))}
			{!isCollapsed && (
				<div className='flex-1 -mt-2 w-full overflow-auto flex flex-col gap-2'>
					{msgIdxList.map((item) => (
						<SiderSubItem
							key={item.idx}
							text={item.label}
							id={item.idx}
							gotoMsg={getCurrentMsg}
						/>
					))}
				</div>
			)}
		</div>
	);
}
