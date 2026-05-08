import Folder from '@/components/common/folder';
import { Tooltip, type ModalProps } from 'antd';
import DefaultModal from '@/components/common/defaultModal';
import { useState } from 'react';
import Island from '@/components/common/island';
import close from '@/assets/close-modal.svg';
import {
	BlockOutlined,
	InfoCircleOutlined,
	SettingOutlined,
} from '@ant-design/icons';
import SettingsModal from './settingsModal';
import { AssessmentInfoitems, ModalStatus } from './const';

const folderItems = [
	{
		icon: <SettingOutlined />,
		title: 'Mindora 隐私设置',
		status: ModalStatus.PRIVACY,
	},
	{
		icon: <BlockOutlined />,
		title: '自定义 Mindora 风格',
		status: ModalStatus.SETTINGS,
	},
	{
		icon: <InfoCircleOutlined />,
		title: '了解 Mindora 采用的心理指标，更直观地理解当前的心理状态',
		status: ModalStatus.ASSESSMENT,
	},
];

export default function AssessmentInfo() {
	const [modalStatus, setModalStatus] = useState(ModalStatus.CLOSE);

	return (
		<>
			<div className='h-[50px] flex justify-center items-center'>
				<span className='font-bold text-[#C84444]'>
					了解 Mindora 的心理指标并自定义您的专属心理助手:
				</span>
				<Folder
					size={0.55}
					color='#C84444'
					items={folderItems.map((item) => (
						<div
							className='w-full h-full flex items-center justify-center'
							onClick={() => {
								setModalStatus(item.status);
							}}
						>
							<Tooltip title={item.title} color='blue'>
								<span className='text-[32px]'>{item.icon}</span>
							</Tooltip>
						</div>
					))}
				/>
			</div>

			<AssessmentInfoModal
				open={modalStatus === ModalStatus.ASSESSMENT}
				onCancel={() => setModalStatus(ModalStatus.CLOSE)}
			/>
			<SettingsModal
				open={
					modalStatus === ModalStatus.SETTINGS ||
					modalStatus === ModalStatus.PRIVACY
				}
				onCancel={() => setModalStatus(ModalStatus.CLOSE)}
				status={modalStatus}
				setTab={setModalStatus}
			/>
		</>
	);
}

function AssessmentInfoModal(props: ModalProps) {
	const assessmentModalConfig: ModalProps = {
		width: 1200,
		closeIcon: (
			<div className='hover:cursor-pointer hover:scale-120 transition-all duration-300'>
				<img src={close} alt='close' />
			</div>
		),
		styles: {
			container: {
				minWidth: 1200,
				padding: 0,
				borderRadius: 20,
				backgroundColor: 'black',
			},
		},
	};
	return (
		<DefaultModal {...props} {...assessmentModalConfig}>
			<div className='h-[600px] p-2 relative text-white'>
				<Island items={AssessmentInfoitems} scale={1} />
			</div>
		</DefaultModal>
	);
}
