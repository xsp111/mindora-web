import { twMerge } from 'tailwind-merge';
import Card from '@/components/common/Card';
import { Radar, Liquid } from '@ant-design/plots';
import { useStore } from 'zustand';
import { userStore } from '@/store';

const labelMap: Record<string, string> = {
	risk: '风险',
	valence: '情绪效价',
	arousal: '唤醒度',
	stress: '压力负荷',
	cognitive_distortion: '认知扭曲',
	regulation: '调节能力',
};

export default function MultiDimensionAnalysis({
	className,
}: {
	className?: string;
}) {
	const dimensions = useStore(
		userStore,
		(state) => state.characteristic.dimensions,
	);
	return (
		<div className={twMerge('h-full px-2 flex flex-col gap-4', className)}>
			<Card className='flex-5 flex'>
				<Radar
					width={350}
					xField='item'
					yField='value'
					colorField='type'
					legend={false}
					data={Object.entries(dimensions)
						.filter(([key]) => key !== 'risk')
						.map(([key, value]) => {
							return {
								item: labelMap[key],
								value,
								type: 'a',
							};
						})}
					axis={{
						x: {
							grid: true,
							gridLineWidth: 1,
							tick: false,
							gridLineDash: [0, 0],
							line: false,
							labelSpacing: 4,
						},
						y: {
							tick: false,
							gridConnect: 'line',
							gridLineWidth: 1,
							gridLineDash: [0, 0],
						},
					}}
					area={{
						style: {
							fillOpacity: 0.7,
						},
					}}
					point={{
						shapeField: 'point',
						sizeField: 2,
					}}
					scale={{
						x: { padding: 0.5, align: 'center' },
						y: { domainMin: -1, domainMax: 1 },
					}}
					style={{
						lineWidth: 2,
					}}
				/>
				<Liquid
					width={150}
					height={200}
					title={{
						title: '心理风险水平',
						titleAlign: 'center',
					}}
					percent={dimensions.risk / 4}
					style={{
						outlineBorder: 3,
						outlineDistance: 8,
						waveLength: 128,
					}}
				/>
			</Card>
			<Card className='flex-1 bg-[#E2E3E8] shadow-[0_0_5px_rgba(0,0,0,0.1)]'></Card>
		</div>
	);
}
