import type { User } from '@/const/user';
import { twMerge } from 'tailwind-merge';
import DefaultModal from '@/components/common/defaultModal';
import DefaultButton from '@/components/common/defaultButton';
import { useEffect, useState } from 'react';
import type { ModalProps } from 'antd';
import Card from '@/components/common/Card';

export default function UserSettings({
	user,
	className,
}: {
	user: User;
	className?: string;
}) {
	const [modalOpen, setModalOpen] = useState(false);
	return (
		<Card className={twMerge('flex-1', className)}>
			<div className='h-full flex flex-col items-center justify-center gap-4'>
				<img src={user?.avatar || ''} alt='avatar' width={96} />
				<span className='text-lg font-bold text-gray-700'>
					{user?.name || '用户昵称'}
				</span>
				<DefaultButton onClick={() => setModalOpen(true)}>
					设置
				</DefaultButton>
			</div>
			<SettingsModal
				open={modalOpen}
				onCancel={() => setModalOpen(false)}
			/>
		</Card>
	);
}

function SettingsModal(props: ModalProps) {
	const { children, ...restProps } = props;
	return <DefaultModal {...restProps}>111</DefaultModal>;
}
