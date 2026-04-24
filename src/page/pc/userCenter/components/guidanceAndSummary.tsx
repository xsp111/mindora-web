import Card from '@/components/common/Card';
import { userStore } from '@/store';
import { useStore } from 'zustand';
import { WordCloud } from '@ant-design/plots';
import CD from '@/const/cd';
import { Popover } from 'antd';

export default function GuidanceAndTips() {
	return (
		<div className='w-full h-full flex flex-col items-center justify-center gap-4'>
			<div className='w-full flex-5'>
				<Summary />
			</div>
			<div className='w-full flex-7'>
				<Guidance />
			</div>
		</div>
	);
}

function Summary() {
	const insights = useStore(
		userStore,
		(state) => state.characteristic.insights,
	);
	const backgroundWords = CD.homePageLoopText.split(' ');
	return (
		<Card className='p-2 flex items-center justify-center relative'>
			<div className='opacity-40'>
				<WordCloud
					height={290}
					width={290}
					padding={0}
					layout={{
						spiral: 'rectangular',
						rotate: 0,
						fontSize: 16,
					}}
					colorField='text'
					data={[
						...backgroundWords,
						...backgroundWords,
						...backgroundWords,
						...backgroundWords,
					].map((keyword) => ({
						text: keyword,
					}))}
				/>
			</div>
			<div className='absolute w-full h-full bg-transparent flex items-center justify-center z-10'>
				<div className='flex flex-col gap-2'>
					{insights.keywords.map((keyword, index) => {
						const isLeft = (index + 1) % 2 === 0;
						return (
							<Popover
								color='white'
								placement={isLeft ? 'left' : 'right'}
								content={
									<div className='w-[200px] p-px'>
										<span className='text-xs font-bold text-gray-700'>
											{insights.summary.replace(
												// TODO: fix characteristic prompt
												'用户',
												'',
											)}
										</span>
									</div>
								}
							>
								<div
									key={keyword}
									className={`${isLeft ? 'ml-30' : 'mr-30'} hover:cursor-pointer`}
								>
									<div className='p-px rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.3)] text-[22px] font-extrabold text-[#C84444] text-center'>
										{keyword}
									</div>
								</div>
							</Popover>
						);
					})}
				</div>
			</div>
		</Card>
	);
}

function Guidance() {
	const suggestions = useStore(
		userStore,
		(state) => state.characteristic.suggestions,
	);
	return (
		<Card className='flex flex-col gap-8 p-6'>
			<div className='text-2xl font-bold text-[#C84444] text-center'>
				尝试做做这些
			</div>
			<div className='text-gray-700 flex flex-col gap-4'>
				{suggestions.map((suggestion) => (
					<div
						key={suggestion}
						className='w-full rounded-lg p-1 flex items-center gap-4 border border-transparent hover:border-[#C84444]'
					>
						<div className='w-2 h-2 rounded-full bg-[#C84444]'></div>
						<span className='flex-1 text-sm'>{suggestion}</span>
					</div>
				))}
			</div>
		</Card>
	);
}
