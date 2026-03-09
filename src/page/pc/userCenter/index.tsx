import { useStore } from 'zustand';
import { userStore } from '@/store';
import foxIcon from '@/assets/fox.svg';

export default function UserCenter() {
	const { user } = useStore(userStore);
	return (
		<div className='w-full h-full px-[5%] flex bg-[#fcfcfc]'>
			<div className=' flex-2 w-full h-full border-r border-gray-300 p-5 flex flex-col'>
				<div className='flex-1 flex items-center'>
					<div className='flex gap-4'>
						<img src={foxIcon} alt='logo' width={32} />
						<div className='flex flex-col'>
							<span className='text-xl font-bold text-gray-700'>
								Welcome，
								<span className='text-[#C84444]'>
									{user?.name}
								</span>
							</span>
							<span className='text-xs text-gray-500'>
								通过您的用户画像，了解您最近的心理状态。
							</span>
						</div>
					</div>
				</div>
				<div className='flex-5 flex items-center py-2 gap-4'>
					<div className='flex-1 h-full rounded-3xl shadow-[0_0_10px_rgba(0,0,0,0.1)] bg-white'>
						{/* profile card */}
						<div className='w-full h-full p-4 flex flex-col items-center justify-center gap-4'>
							<img
								src={user?.avatar || ''}
								alt='avatar'
								width={96}
							/>
							<span className='text-lg font-bold text-gray-700'>
								{user?.name || '用户昵称'}
							</span>
						</div>
					</div>
					<div className='flex-2 w-full h-full px-2 flex flex-col gap-4'>
						<div className='flex-3 w-full h-full flex gap-4'>
							<div className='w-full h-full rounded-3xl shadow-[0_0_10px_rgba(0,0,0,0.1)] bg-white'></div>
							<div className='w-full h-full rounded-3xl shadow-[0_0_10px_rgba(0,0,0,0.1)] bg-white'></div>
						</div>
						<div className='flex-1 h-full rounded-3xl shadow-[0_0_10px_rgba(0,0,0,0.1)] bg-white'></div>
					</div>
				</div>
				<div className='flex-4 flex items-center'>333</div>
			</div>
			<div className='flex-1 w-full h-full'></div>
		</div>
	);
}
