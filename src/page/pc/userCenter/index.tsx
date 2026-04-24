import { useStore } from 'zustand';
import { userStore } from '@/store';
import useCheckLoginState from '@/hooks/useCheckLoginState';
import { useEffect } from 'react';
import AnalysicDisplay from './components/analysicDisplay';
import GuidanceAndTips from './components/guidanceAndSummary';

export default function UserCenter() {
	const getCharacteristic = useStore(
		userStore,
		(state) => state.getCharacteristic,
	);
	useCheckLoginState();

	useEffect(() => {
		getCharacteristic();
	}, []);

	return (
		<div className='w-full h-full flex justify-center bg-[#f5f6fa]'>
			<div className='w-[1000px] h-full border-r border-gray-200 p-5'>
				<AnalysicDisplay />
			</div>
			<div className='w-[350px] h-full p-5'>
				<GuidanceAndTips />
			</div>
		</div>
	);
}
