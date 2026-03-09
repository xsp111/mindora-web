import DefaultButton from './defaultButton';
import DefaultModal from './defaultModal';
import EmailIcon from '@/assets/email-login.svg';
import CardSwap, { Card } from '../3party/cardSwapper';
import { Skeleton } from 'antd';
import ProfileChild from '@/assets/profile-child.svg';
import ProfileMan from '@/assets/profile-man.svg';
import ProfileWoman from '@/assets/profile-woman.svg';
import { useContext, useState } from 'react';
import { useStore } from 'zustand';
import { userStore } from '@/store';
import type { LoginOrSignupInfo } from '@/const/user';
import { messageContext } from './rootLayout';
import { loginValidate, signupValidate, emailLoginValidate } from '../../utils';

const profileImgList = [ProfileChild, ProfileMan, ProfileWoman];
enum ModalType {
	Login = 1,
	Signup = 2,
	EmailLogin = 3,
}

function ProfileExample() {
	return (
		<CardSwap
			cardDistance={60}
			verticalDistance={100}
			delay={3000}
			pauseOnHover={false}
		>
			{profileImgList.map((ProfileImg, index) => (
				<Card key={index}>
					<div className='h-full w-full flex flex-col gap-4'>
						<div className='w-full flex items-center gap-2'>
							<img src={ProfileImg} width={160} />
							<Skeleton />
						</div>
						<div className='w-full flex items-center gap-2'>
							<Skeleton.Image />
							<Skeleton.Node />
							<div className='w-full ml-4 flex flex-col gap-2'>
								<Skeleton.Input />
								<Skeleton.Input />
								<Skeleton.Input />
							</div>
							<div className='w-full ml-4 flex flex-col gap-2'>
								<Skeleton.Avatar />
								<Skeleton.Avatar />
								<Skeleton.Avatar />
							</div>
						</div>
						<Skeleton />
					</div>
				</Card>
			))}
		</CardSwap>
	);
}

function LoginForm(props: {
	setModalType: (type: ModalType) => void;
	closeModal: () => void;
}) {
	const { setModalType, closeModal } = props;
	const messageApi = useContext(messageContext);
	const { login } = useStore(userStore);
	const [loginInfo, setLoginInfo] = useState<LoginOrSignupInfo>({
		name: '',
		password: '',
		remember: false,
	});

	async function handleLogin() {
		const validateRes = loginValidate(loginInfo);
		if (!validateRes.success) {
			messageApi.error(validateRes.msg);
			return;
		}
		const res = await login(loginInfo);
		if (res.success) {
			closeModal();
			messageApi.success('登录成功');
		} else {
			messageApi.error(res.msg);
		}
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value, checked } = e.target;
		setLoginInfo({
			...loginInfo,
			[name]: name === 'remember' ? checked : value,
		});
	}
	return (
		<div className='w-full mt-1 flex flex-col gap-4'>
			<div className='w-full'>
				<span className='text-gray-700 text-xs'>账号</span>
				<input
					name='name'
					onChange={handleChange}
					className='w-full h-8 border-b border-gray-500 px-2 focus:outline-none focus:border-[#C84444]'
					placeholder='请输入账号'
				/>
			</div>
			<div className='w-full'>
				<span className='text-gray-700 text-xs'>密码</span>
				<input
					name='password'
					onChange={handleChange}
					className='w-full h-8 border-b border-gray-500 px-2 focus:outline-none focus:border-[#C84444]'
					placeholder='请输入密码'
					type='password'
				/>
			</div>
			<div className='w-full pl-1 flex justify-between items-center'>
				<div className='flex items-center gap-1'>
					<input
						name='remember'
						onChange={handleChange}
						type='checkbox'
						className='w-3 h-3 hover:cursor-pointer hover:border-[#C84444]'
					/>
					<span className='text-gray-700 text-[11px]'>记住登录</span>
				</div>
				<span
					className='justify-self-end text-[#C84444] text-[11px] hover:text-[#ff9b9b] hover:cursor-pointer'
					onClick={() => {
						setModalType(ModalType.Signup);
					}}
				>
					还没账号？点击注册
				</span>
			</div>
			<div className='mt-8 flex flex-col gap-4'>
				<DefaultButton
					className='w-full h-8 rounded-2xl hover:bg-[#ff9b9b]'
					onClick={handleLogin}
				>
					登录
				</DefaultButton>
				<DefaultButton
					className='w-full h-8 bg-gray-200 text-gray-600 border-none rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100 hover:text-gray-700'
					onClick={() => {
						setModalType(ModalType.EmailLogin);
					}}
				>
					<img src={EmailIcon} width={18} />
					邮箱登录
				</DefaultButton>
			</div>
		</div>
	);
}

function EmailLoginForm(props: {
	setModalType: (type: ModalType) => void;
	closeModal: () => void;
}) {
	const { setModalType, closeModal } = props;
	const messageApi = useContext(messageContext);
	const { sendVerifyEmail, wait4EmailVerify } = useStore(userStore);
	const [email, setEmail] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [showTip2OperaOnEmail, setShowTip2OperaOnEmail] =
		useState<boolean>(false);

	async function handleLogin() {
		setLoading(true);
		const validateRes = emailLoginValidate(email);
		if (!validateRes.success) {
			messageApi.error(validateRes.msg);
			setLoading(false);
			return;
		}
		const res = await sendVerifyEmail(email);
		if (res.success) {
			// closeModal();
			const { verifyToken } = res.data as { verifyToken: string };
			messageApi.success(res.msg);
			setShowTip2OperaOnEmail(true);
			wait4EmailVerify(verifyToken, (res) => {
				if (res === 'success') {
					setLoading(false);
					setShowTip2OperaOnEmail(false);
					messageApi.success('登录成功');
					closeModal();
				} else if (res === 'error') {
					setLoading(false);
					setShowTip2OperaOnEmail(false);
					messageApi.error('登录失败');
				} else if (res === 'timeout') {
					setLoading(false);
					setShowTip2OperaOnEmail(false);
					messageApi.error('登录超时');
				}
			});
		} else {
			messageApi.error(res.msg);
		}
	}

	return (
		<div className='w-full mt-11 flex flex-col justify-center gap-4'>
			<div className='w-full'>
				{!showTip2OperaOnEmail ? (
					<>
						<span className='text-gray-700 text-[14px]'>邮箱</span>
						<input
							name='name'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='w-full mt-2 h-8 border-b border-gray-500 px-2 focus:outline-none focus:border-[#C84444]'
							placeholder='请输入您的邮箱'
						/>
					</>
				) : (
					<>
						<div className='flex items-center gap-2'>
							<img src={EmailIcon} width={24} />
							<span className='text-gray-700 text-lg font-bold'>
								请查收验证邮件并点击验证
							</span>
						</div>
						<div className='text-gray-400 font-bold text-center'>
							在五分钟内完成操作
						</div>
					</>
				)}
			</div>
			<div className='w-full pl-1 flex justify-end items-center'>
				<div className='flex items-center gap-1'>
					<span className='text-gray-500 text-xs'>
						新用户将自动注册
					</span>
				</div>
			</div>
			<div className='mt-8 flex flex-col items-center gap-2'>
				<DefaultButton
					className='w-full h-8 rounded-2xl hover:bg-[#ff9b9b]'
					onClick={handleLogin}
					loading={loading}
				>
					邮箱验证
				</DefaultButton>
				<span
					className='text-[#C84444] text-[11px] hover:text-[#ff9b9b] hover:cursor-pointer'
					onClick={() => {
						setModalType(ModalType.Login);
					}}
				>
					账号密码登录
				</span>
			</div>
		</div>
	);
}

function SignupForm(props: {
	setModalType: (type: ModalType) => void;
	closeModal: () => void;
}) {
	const { setModalType, closeModal } = props;
	const messageApi = useContext(messageContext);
	const { signup } = useStore(userStore);
	const [signupInfo, setSignupInfo] = useState<LoginOrSignupInfo>({
		name: '',
		password: '',
		confirmPassword: '',
	});

	async function handleLogin() {
		const validateRes = signupValidate(signupInfo);
		if (!validateRes.success) {
			messageApi.error(validateRes.msg);
			return;
		}
		const res = await signup(signupInfo);
		if (res.success) {
			closeModal();
			messageApi.success('注册成功');
		} else {
			messageApi.error(res.msg);
		}
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setSignupInfo({
			...signupInfo,
			[name]: value,
		});
	}
	return (
		<div className='w-full mt-1 flex flex-col gap-3'>
			<div className='w-full'>
				<span className=' text-gray-500 font-bold text-[10px] '>
					用户名
				</span>
				<input
					name='name'
					onChange={handleChange}
					className='w-full h-7 px-2 border-b border-gray-500 text-xs focus:outline-none focus:border-[#C84444]'
					placeholder='请输入用户名'
				/>
			</div>
			<div className='w-full'>
				<span className=' text-gray-500 font-bold text-[10px] '>
					密码
				</span>
				<input
					name='password'
					onChange={handleChange}
					className='w-full h-7 px-2 border-b border-gray-500 text-xs focus:outline-none focus:border-[#C84444]'
					placeholder='请输入6位以上密码'
					type='password'
				/>
			</div>
			<div className='w-full'>
				<span className=' text-gray-500 font-bold text-[10px] '>
					确认密码
				</span>
				<input
					name='confirmPassword'
					onChange={handleChange}
					className='w-full h-7 px-2 border-b border-gray-500 text-xs focus:outline-none focus:border-[#C84444]'
					placeholder='请再次输入密码'
					type='password'
				/>
			</div>
			<div className='w-full flex justify-end items-center'>
				<span
					className='justify-self-end text-[#C84444] text-[11px] hover:text-[#ff9b9b] hover:cursor-pointer'
					onClick={() => {
						setModalType(ModalType.Login);
					}}
				>
					已有账号？点击登录
				</span>
			</div>
			<DefaultButton
				className='w-full mt-4 h-8 rounded-2xl hover:bg-[#ff9b9b]'
				onClick={handleLogin}
			>
				注册并登录
			</DefaultButton>
		</div>
	);
}

export default function LoginOrSignupModal({
	open,
	onCancel,
}: {
	open: boolean;
	onCancel: () => void;
}) {
	const [modalType, setModalType] = useState(ModalType.Login);
	return (
		<DefaultModal
			open={open}
			onCancel={onCancel}
			styles={{
				container: {
					padding: '0px',
					width: '900px',
					height: '525px',
					transform: 'translateX(-190px)',
				},
				header: {
					display: 'none',
				},
				body: {
					width: '100%',
					height: '100%',
				},
			}}
		>
			<div className='w-full h-full flex items-center gap-4'>
				<div className='relative flex-2 w-full h-full bg-[#F5F5F5] border-r border-gray-200 rounded-l-lg rounded-r-2xl overflow-hidden'>
					<div className='absolute top-7 left-4 z-10 flex flex-col '>
						<img src='/title.svg' width={170} />
						<div className='ml-2 mt-4 text-[12px] text-gray-600 font-bold flex flex-col '>
							<span>在持续的对话与互动中为</span>
							<span>每位用户建立专属的</span>
							<span className='mt-1 text-[#C84444] text-xl'>
								个人心理画像
							</span>
						</div>
					</div>
					<ProfileExample />
				</div>
				<div className='flex-1 w-full h-full bg-white rounded-r-lg px-6 py-8 flex flex-col items-center gap-4'>
					<img src='/logo.svg' width={48} />
					<span className='font-bold text-3xl'>
						{modalType === ModalType.Signup
							? 'Welcome !'
							: 'Welcome back !'}
					</span>
					<span className='-mt-2 text-gray-400 text-xs'>
						请登录或注册后使用 Mindora
					</span>
					{modalType === ModalType.Login && (
						<LoginForm
							setModalType={setModalType}
							closeModal={onCancel}
						/>
					)}
					{modalType === ModalType.Signup && (
						<SignupForm
							setModalType={setModalType}
							closeModal={onCancel}
						/>
					)}
					{modalType === ModalType.EmailLogin && (
						<EmailLoginForm
							setModalType={setModalType}
							closeModal={onCancel}
						/>
					)}
				</div>
			</div>
		</DefaultModal>
	);
}
