import React, { useEffect, useRef, type RefObject } from 'react';

interface ScrollBarProps {
	containerRef: RefObject<HTMLDivElement>;
	Styles?: React.CSSProperties;
}

export default function ScrollTrack(props: ScrollBarProps) {
	const { containerRef, Styles } = props;
	const scrollTrackRef = useRef<HTMLDivElement>(null);
	const barRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const track = scrollTrackRef.current;
		const container = containerRef.current;
		const bar = barRef.current;
		let timer: number;

		function debounce(fn: () => void, delay: number) {
			return () => {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(fn, delay);
			};
		}
		const debounceReset = debounce(() => {
			if (container && track && bar) {
				track.style.backgroundColor = 'transparent';
				bar.style.backgroundColor = 'transparent';
			}
		}, 500);

		function handleScroll() {
			if (container && track && bar) {
				track.style.backgroundColor = '#6a7282';
				bar.style.backgroundColor = '#e5e7eb';
				const clientHeight = bar.clientHeight;
				const scrollHeight = container.scrollHeight;

				if (scrollHeight <= clientHeight) {
					track.style.height = `0px`;
					return;
				}
				const scrollTop = container.scrollTop;
				const factor = clientHeight / scrollHeight;
				const scrollTrackHeight = clientHeight * factor;
				const scrollBarTop = scrollTop;
				const scrollTrackTop = factor * scrollTop;
				bar.style.transform = `translateY(${scrollBarTop}px)`;
				track.style.transform = `translateY(${scrollTrackTop}px)`;
				track.style.height = `${scrollTrackHeight}px`;
				debounceReset();
			}
		}

		if (container) {
			container.addEventListener('scroll', handleScroll);
		}
		return () => {
			if (container) {
				container.removeEventListener('scroll', handleScroll);
			}
			clearTimeout(timer);
		};
	}, [containerRef.current]);

	return (
		<>
			<div
				className='absolute top-0 right-0 w-1 transition-colors duration-500 ease-out'
				style={{
					height: `${containerRef.current?.offsetHeight}px`,
				}}
				ref={barRef}
			>
				<div
					className='scrollbar-track absolute top-0 right-0 w-1 transition-colors duration-500 ease-out'
					style={Styles}
					ref={scrollTrackRef}
				></div>
			</div>
		</>
	);
}
