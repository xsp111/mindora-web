import { Link, Outlet, useLocation } from 'react-router';
import logo from '../../assets/logo-with-title.svg';
import navUser from '../../assets/nav-user.svg';
import navStart from '../../assets/nav-start.svg';
import navDoc from '../../assets/nav-doc.svg';
import { createContext } from 'react';
import DefaultButton from '../common/defaultButton';
import LoginOrSignupModal from './loginOrSignupModal';
import { message } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import { useStore } from 'zustand';
import { userStore } from '../../store';
import NavUserArea from './navUserArea';

const navsInfo = [
	{
		icon: navDoc,
		text: '文档',
		href: '/doc',
	},
	{
		icon: navStart,
		text: '开始对话',
		href: '/start',
	},
	{
		icon: navUser,
		text: '个人中心',
		href: '/user',
	},
];

export const messageContext = createContext<MessageInstance>(
	{} as MessageInstance,
);

function NavItem({
	icon,
	text,
	href,
}: {
	icon: string;
	text: string;
	href: string;
}) {
	const isActive = useLocation().pathname === href;

	return (
		<Link to={href}>
			<div
				className={`h-16 flex justify-center items-center border-b-2 border-transparent ${
					isActive
						? 'border-b-[#B2272F]'
						: ' hover:border-b-[#B2272F] hover:cursor-pointer'
				}`}
			>
				<img src={icon} width={24} />
				<span className='ml-2 font-bold text-gray-700'>{text}</span>
			</div>
		</Link>
	);
}

export default function RootLayout() {
	const { isLogin, loginOrSignupModalVisible, setLoginOrSignupModalVisible } =
		useStore(userStore);
	const [messageApi, contextHolder] = message.useMessage();
	return (
		<>
			{contextHolder}
			<messageContext.Provider value={messageApi}>
				<div className='h-screen min-w-[1500px]'>
					<div className='fixed left-0 top-0 w-full h-16 px-[5%] bg-white z-100 border-b border-gray-100 text-gray-900'>
						<div className='h-full min-w-[1500px] flex items-center justify-between'>
							<Link to='/'>
								<img src={logo} width={200} />
							</Link>
							<div className='flex items-center gap-8'>
								{navsInfo.map((nav) => (
									<NavItem key={nav.href} {...nav} />
								))}
								<div className='w-24 pb-0.5'>
									{isLogin ? (
										<NavUserArea />
									) : (
										<DefaultButton
											onClick={() =>
												setLoginOrSignupModalVisible(
													true,
												)
											}
										>
											登录/注册
										</DefaultButton>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className='h-full pt-16'>
						<Outlet />
					</div>
				</div>
				<LoginOrSignupModal
					open={loginOrSignupModalVisible}
					onCancel={() => setLoginOrSignupModalVisible(false)}
				/>
			</messageContext.Provider>
		</>
	);
}
