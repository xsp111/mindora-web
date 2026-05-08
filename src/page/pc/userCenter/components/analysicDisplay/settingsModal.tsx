import { Input, Select, Switch, Tooltip, type ModalProps } from 'antd';
import DefaultModal from '@/components/common/defaultModal';
import {
	BlockOutlined,
	CloseOutlined,
	SettingOutlined,
} from '@ant-design/icons';
import {
	ModalStatus,
	SettingsItems,
	StyleItems,
	type ModalStatusType,
} from './const';
import DefaultButton from '@/components/common/defaultButton';
import { useState } from 'react';

const settingItems = [
	{
		title: '个性化',
		icon: <BlockOutlined />,
		status: ModalStatus.SETTINGS,
	},
	{
		title: '隐私设置',
		icon: <SettingOutlined />,
		status: ModalStatus.PRIVACY,
	},
];

export default function SettingsModal({
	open,
	onCancel,
	status,
	setTab,
}: ModalProps & {
	status: ModalStatusType;
	setTab: (status: ModalStatusType) => void;
}) {
	return (
		<DefaultModal
			width={680}
			styles={{
				container: {
					height: 600,
					padding: 8,
				},
				body: {
					height: '100%',
				},
			}}
			closeIcon={null}
			open={open}
			onCancel={onCancel}
		>
			<div className='w-full h-full flex'>
				<div className='w-[180px] h-full flex flex-col gap-1 items-center'>
					<div className='h-[50px] w-full flex items-center'>
						<div
							className='pl-2 w-5 h-5 text-[20px] font-bold cursor-pointer'
							onClick={() => {
								if (onCancel) {
									//@ts-ignore
									onCancel();
								}
							}}
						>
							<CloseOutlined size={36} />
						</div>
					</div>
					{settingItems.map((item) => (
						<div
							key={item.status}
							className={`w-full px-2 py-1 rounded-md flex items-center gap-2 cursor-pointer ${status === item.status ? 'bg-gray-100' : 'hover:bg-gray-100 transition-all duration-300'}`}
							onClick={() => {
								setTab(item.status);
							}}
						>
							<span className='text-[20px]'>{item.icon}</span>
							<span className='text-[14px]'>{item.title}</span>
						</div>
					))}
				</div>
				<div className='p-2 flex-1 h-full'>
					{status === ModalStatus.SETTINGS && <SettingsForm />}
					{status === ModalStatus.PRIVACY && <PrivacyForm />}
				</div>
			</div>
		</DefaultModal>
	);
}

function SettingsForm() {
	const [form, setForm] = useState<Record<string, number | string>>({
		style: 0,
		gentle: 0,
		passion: 0,
		titleAndList: 0,
		emoji: 0,
		custom: '',
	});

	function onFormChange(target: string, value: number | string) {
		setForm({
			...form,
			[target]: value,
		});
	}

	function onSave() {
		// TODO: 提交表单数据
		console.log('form data:', form);
	}

	return (
		<div className='relative h-full'>
			<div className='pb-3 mb-4 border-b border-gray-200 text-lg font-bold'>
				个性化设置
			</div>
			<div className='pb-4 mb-4 border-b border-gray-200'>
				<div className='flex justify-between items-center mb-4'>
					<div className='flex flex-col'>
						<span className='text-[15px]'>基本风格和语调</span>
						<span className='text-[12px] text-gray-400'>
							设置 Mindora 回复的风格和语调，这不会影响 Mindora
							的功能
						</span>
					</div>
					<Select
						onSelect={(value) => onFormChange('style', value)}
						defaultValue={0}
						style={{ width: 100 }}
						options={StyleItems}
					/>
				</div>
				<div className='flex flex-col justify-between mb-4'>
					<span className='text-[15px]'>特征</span>
					<span className='text-[12px] text-gray-400'>
						在基本风格语调的基础上，设置额外的自定义项
					</span>
				</div>
				<div className='h-full flex flex-col gap-2'>
					{SettingsItems.map((item) => (
						<div
							key={item.name}
							className='h-8 py-6 flex justify-between items-center'
						>
							<span className='text-[14px]'>{item.name}</span>
							<Select
								onSelect={(value) =>
									onFormChange(item.id, value)
								}
								value={(form[item.id] as number) || 0}
								style={{ width: 80 }}
								optionRender={({ label, value }) => (
									<Tooltip
										placement='left'
										title={
											value === -1
												? item.deDesc
												: value === 1
													? item.enhanceDesc
													: ''
										}
									>
										<span className='text-[14px]'>
											{label}
										</span>
									</Tooltip>
								)}
								options={[
									{ label: '减弱', value: -1 },
									{ label: '默认', value: 0 },
									{ label: '增强', value: 1 },
								]}
							/>
						</div>
					))}
				</div>
			</div>
			<div className='flex flex-col gap-2'>
				<span className='text-[15px]'>自定义指令</span>
				<Input.TextArea
					rows={2}
					value={form.custom || ''}
					autoSize={{ minRows: 2, maxRows: 2 }}
					placeholder='其他行为，风格和语调偏好设置'
					onChange={(e) => onFormChange('custom', e.target.value)}
				/>
			</div>
			<DefaultButton
				className='absolute bottom-0 right-0'
				onClick={onSave}
			>
				保存
			</DefaultButton>
		</div>
	);
}

function PrivacyForm() {
	const [form, setForm] = useState<Record<string, number | string | boolean>>(
		{
			nickname: '',
			career: '',
			detail: '',
			useMemory: true,
			reset: 0,
		},
	);

	function onFormChange(target: string, value: number | string) {
		setForm({
			...form,
			[target]: value,
		});
	}

	function onSave() {
		// TODO: 提交表单数据
		console.log('form data:', form);
	}

	return (
		<div className='relative h-full'>
			<div className='pb-3 mb-4 border-b border-gray-200 text-lg font-bold'>
				关于您
			</div>
			<div className='pb-4 mb-4 border-b flex flex-col gap-4 border-gray-200'>
				{[
					{
						id: 'nickname',
						label: '称呼',
						value: form.nickname || '',
						desc: '您想要 Mindora 如何称呼您',
					},
					{
						id: 'career',
						label: '职业',
						value: form.career || '',
						desc: '您的职业是？',
					},
					{
						id: 'detail',
						label: '详情',
						value: form.detail || '',
						desc: '您的兴趣，价值观或者偏好',
					},
				].map((item) => (
					<div key={item.label} className='flex flex-col gap-2'>
						<span className='text-[16px]'>{item.label}</span>
						<Input
							placeholder={item.desc}
							value={item.value as string}
							onChange={(e) =>
								onFormChange(item.id, e.target.value)
							}
						/>
					</div>
				))}
			</div>
			<div className='flex flex-col gap-6'>
				<span className='text-[18px]'>记忆</span>
				<div className='flex flex-col gap-6'>
					<div className='flex items-center justify-between'>
						<div className='flex flex-col'>
							<span className='text-[15px]'>参考保存的记忆</span>
							<span className='text-[12px] text-gray-400'>
								让 Mindora 在不同会话中参考保存的记忆进行回复
							</span>
						</div>
						<Switch />
					</div>
					<div className='flex items-center justify-between'>
						<div className='flex flex-col'>
							<span className='text-[15px]'>
								重置 Mindora 的记忆
							</span>
							<span className='text-[12px] text-gray-400'>
								清空 Mindora
								过去为您描绘的画像，基于指定时间重新开始记忆
							</span>
						</div>
						<Select
							onSelect={(value) => onFormChange('reset', value)}
							value={form.reset as number}
							style={{ width: 80 }}
							options={[
								{ label: '全部', value: 0 },
								{ label: '1天', value: 1 },
								{ label: '2天', value: 2 },
								{ label: '30天', value: 3 },
							]}
						/>
					</div>
				</div>
			</div>
			<DefaultButton
				className='absolute bottom-0 right-0'
				onClick={onSave}
			>
				保存
			</DefaultButton>
		</div>
	);
}
