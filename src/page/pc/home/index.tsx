import { Link } from 'react-router';
import TextType from '../../../components/3party/textType';
import LoopCircle from '../../../components/3party/loopCircle';
import CD from '../../../const/cd';
import Exam from '../../../assets/example.svg';

export default function HomePage() {
	return (
		<>
			<div className='relative w-full h-full pt-20 flex flex-col items-center gap-10 '>
				<div className='w-[1080px] flex items-center gap-4'>
					<div className='flex-1 flex flex-col items-center gap-4'>
						<div className='flex items-center gap-4'>
							<span className='flex justify-end'>
								<img src='/logo.svg' alt='logo' width={108} />
							</span>
							<div className='relative w-[420px] h-full flex flex-col justify-end '>
								<span className='absolute bottom-0 mb-3 pl-1 font-bold text-sm text-gray-900'>
									{CD.homePageSubTitle as string}
								</span>
								<TextType
									text={CD.homePageTypeText as string}
									className='absolute top-0 mt-1 font-bold text-4xl text-[#C84444]'
								/>
							</div>
						</div>
						<div className='w-full pr-8 flex flex-col'>
							<span className=' text-gray-500'>
								{CD.homePageDescText as string}
							</span>
						</div>
						<div className='w-full flex items-center gap-8 font-bold text-lg'>
							<Link to='/start'>
								<button className='w-[200px] h-[50px] bg-[#C84444] text-white rounded-[25px] hover:bg-[#ff9b9b] hover:cursor-pointer hover:transform hover:scale-110 transition-all duration-300'>
									开始对话
								</button>
							</Link>
							<Link to='/doc'>
								<button className='w-[200px] h-[50px] border border-gray-400 text-gray-500 rounded-[25px] hover:cursor-pointer'>
									探索 Mindora
								</button>
							</Link>
						</div>
					</div>
					<div className='flex-1 w-full h-full rounded-[25px] bg-gray-300 shadow-xl'>
						<img src={Exam} />
					</div>
				</div>

				<div className='w-full flex justify-center items-center gap-8'>
					{(CD.homePageWhatCanDoDesc as Record<string, string>[]).map(
						(item) => {
							const descList = (item.desc as string).split('\n');
							return (
								<div
									key={item.title}
									className='relative w-[360px] h-[180px] p-4 bg-[#fff3f3] rounded-lg shadow-xl flex flex-col gap-4'
								>
									<span className='font-bold text-2xl text-gray-700'>
										{item.title}
									</span>
									<div className='flex flex-col gap-2 text-xs text-gray-500 font-bold'>
										{descList.map((desc, index) => (
											<span key={index}>{desc}</span>
										))}
									</div>
									<div className='absolute top-3 right-5'>
										<img
											src={item.icon}
											width={36}
											alt='emo'
										/>
									</div>
								</div>
							);
						},
					)}
				</div>
				<div className='absolute bottom-0 translate-y-[-120px] left-0 z-[-1] w-full h-[100px]'>
					<LoopCircle
						marqueeText={CD.homePageLoopText as string}
						speed={0.2}
						curveAmount={300}
						interactive={false}
					/>
				</div>
			</div>

			<div className='w-full h-20 bg-[#f5f5f5] shadow-md flex items-center justify-center'>
				<span className='text-gray-500'>Made by xsp111</span>
			</div>
		</>
	);
}
