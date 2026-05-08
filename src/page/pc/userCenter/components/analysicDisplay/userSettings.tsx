import type { User } from '@/const/user';
import { twMerge } from 'tailwind-merge';
import DefaultModal from '@/components/common/defaultModal';
import DefaultButton from '@/components/common/defaultButton';
import { useCallback, useRef, useState } from 'react';
import type { ModalProps } from 'antd';
import Card from '@/components/common/Card';
import DefaultForm from '@/components/common/defaultForm';
import { useStore } from 'zustand';
import { userStore } from '@/store';
import Cropper, { type Area } from 'react-easy-crop';
import {
	CameraOutlined,
	CheckOutlined,
	CloseOutlined,
} from '@ant-design/icons';
import { getCroppedImg } from '@/utils';

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
			<UserSettingsModal
				open={modalOpen}
				onCancel={() => setModalOpen(false)}
			/>
		</Card>
	);
}

function UserSettingsModal(props: ModalProps) {
	const { open, onCancel } = props;
	const user = useStore(userStore, (state) => state.user);
	const [form, setForm] = useState({
		nickname: '',
		email: '',
	});
	const [file, setFile] = useState<File | undefined>(undefined);
	const [cropOpen, setCropOpen] = useState(false);
	const fileSelectorRef = useRef<HTMLInputElement>(null);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	}

	async function handleSave() {
		const formData = new FormData();
		formData.append('nickname', form.nickname);
		formData.append('email', form.email);
		if (file) {
			formData.append('avatar', file);
		}
	}

	return (
		<DefaultModal
			closeIcon={null}
			styles={{
				container: {
					width: 450,
					height: 460,
				},
				body: {
					width: '100%',
					height: '100%',
				},
			}}
			open={open}
		>
			<div className='relative w-full h-full flex flex-col items-center gap-4'>
				<div className='flex w-full'>
					<span className='text-[16px]'>编辑个人资料</span>
				</div>
				<div className='relative w-full h-36 flex items-center justify-center rounded-full cursor-pointer'>
					<div
						className='relative w-36 h-36 rounded-[72px] overflow-hidden'
						onClick={() => {
							if (file) {
								setCropOpen(true);
							}
						}}
					>
						<img
							src={
								file?.name
									? URL.createObjectURL(file)
									: user?.avatar || ''
							}
							alt='avatar'
							width={144}
							height={144}
						/>
					</div>
					<label
						htmlFor='img-select'
						className='absolute bottom-2 right-[33%] border border-gray-200 cursor-pointer bg-white text-black p-2 rounded-full flex items-center justify-center'
					>
						<CameraOutlined />
					</label>
					<input
						ref={fileSelectorRef}
						type='file'
						accept='.jpg,.jpeg,.png'
						id='img-select'
						className='absolute opacity-0 -z-10'
						onChange={() => {
							setCropOpen(true);
							setFile(fileSelectorRef.current?.files?.[0]);
						}}
					/>
					{cropOpen && file && (
						<ImgCropper
							file={file!}
							close={() => setCropOpen(false)}
							setFile={setFile}
						/>
					)}
				</div>
				<div className='w-[90%]'>
					<DefaultForm
						config={{
							labelClassName: 'text-[14px]',
							items: [
								{
									name: 'nickname',
									label: '称呼',
									placeholder: user?.name || '',
									onChange: handleChange,
								},
								{
									name: 'email',
									label: '邮箱',
									placeholder: user?.email || '',
									onChange: handleChange,
								},
							],
						}}
					/>
				</div>
				<div className='flex justify-end gap-4 absolute bottom-0 right-0'>
					<DefaultButton
						className='bg-white text-black font-normal hover:bg-gray-200 border-gray-300'
						onClick={() => {
							setFile(undefined);
							//@ts-ignore
							onCancel();
						}}
					>
						取消
					</DefaultButton>
					<DefaultButton onClick={handleSave}>保存</DefaultButton>
				</div>
			</div>
		</DefaultModal>
	);
}

function ImgCropper({
	file,
	setFile,
	close,
}: {
	file: File;
	setFile: (file: File | undefined) => void;
	close: () => void;
}) {
	const [croppedArea, setCroppedArea] = useState<Area>({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	});
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);

	const onCropComplete = useCallback((_: any, croppedArea: Area) => {
		setCroppedArea(croppedArea);
	}, []);

	async function onConfirmCropped() {
		try {
			const croppedImg = await getCroppedImg(
				URL.createObjectURL(file),
				croppedArea,
			);
			if (!croppedImg) throw new Error('裁剪失败');
			setFile(new File([croppedImg], file.name, { type: file.type }));
		} catch (error) {
			console.log(error);
			return;
		}
		close();
	}

	return (
		<div className='absolute top-0 left-0 w-full h-full'>
			<Cropper
				image={URL.createObjectURL(file)}
				crop={crop}
				zoom={zoom}
				cropShape='round'
				cropSize={{
					height: 144,
					width: 144,
				}}
				aspect={1}
				onCropChange={setCrop}
				onCropComplete={onCropComplete}
				onZoomChange={setZoom}
			/>
			<div
				className='absolute bottom-0 left-2 text-[24px] cursor-pointer text-white'
				onClick={() => {
					setFile(undefined);
					close();
				}}
			>
				<CloseOutlined />
			</div>
			<div
				className='absolute bottom-0 right-2 text-[24px] cursor-pointer text-white'
				onClick={onConfirmCropped}
			>
				<CheckOutlined />
			</div>
		</div>
	);
}
