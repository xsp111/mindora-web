import { useStore } from 'zustand';
import { userStore } from '@/store';
import foxIcon from '@/assets/fox.svg';
import type { User } from '@/const/user';
import UserSettings from './userSettings';
import MultiDimensionAnalysis from './multiDimensionAnalysis';
import { Line } from '@ant-design/plots';

export default function AnalysicDisplay() {
	const user = useStore(userStore, (state) => state.user);
	const defaultValue = '用户昵称';
	return (
		<div className='w-full h-full flex flex-col gap-4'>
			<div className='pl-5 flex-1 flex items-center'>
				<ProfileCenterHeader userName={user?.name || defaultValue} />
			</div>
			<div className='flex-10 flex items-center gap-4'>
				<UserSettings className='flex-1' user={user} />
				<MultiDimensionAnalysis className='flex-2' />
			</div>
			<div className='flex-8'>
				<TrendChart />
			</div>
		</div>
	);
}

function ProfileCenterHeader({ userName }: { userName: User['name'] }) {
	const overview = useStore(
		userStore,
		(state) => state.characteristic.overview,
	);
	return (
		<div className='w-full flex items-center justify-between'>
			<div className='flex gap-4'>
				<img src={foxIcon} alt='logo' width={32} />
				<div className='flex flex-col'>
					<span className='text-xl font-bold text-gray-700'>
						Welcome，
						<span className='text-[#C84444]'>{userName}</span>
					</span>
					<span className='text-xs text-gray-500'>
						通过您的用户画像，了解您最近的心理状态。
					</span>
				</div>
			</div>
			<div className='mr-4 text-gray-700 font-bold'>{overview}</div>
		</div>
	);
}

function TrendChart() {
	const data = useStore(
		userStore,
		(state) => state.characteristic.emotionTrend7d,
	);
	return (
		<Line
			width={900}
			height={300}
			data={data}
			xField='date'
			yField='valence'
			shapeField='smooth'
			colorField='field'
			title='情感趋势'
			scale={{
				color: {
					domain: ['valence'],
					range: ['#C84444'],
				},
				y: {
					domainMin: -1,
					domainMax: 1,
				},
			}}
			interaction={{
				tooltip: {
					render: (_: any, { items }: any) => {
						const isDepressed = items[0].value <= 0;
						return (
							<div
								className={`${isDepressed ? 'text-blue-300' : 'text-green-500'} font-bold`}
							>
								{isDepressed
									? '当日情绪较为失落'
									: '当日情绪较为积极'}
							</div>
						);
					},
				},
			}}
			style={{
				lineWidth: 2,
			}}
		/>
	);
}
