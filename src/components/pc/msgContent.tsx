import voiceIcon from '@/assets/voice.svg';
import speakIcon from '@/assets/speak.svg';
import arrowIcon from '@/assets/arrow.svg';
import { useContext, useEffect, useRef, useState, type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import copyIcon from '@/assets/copy.svg';
import retryIcon from '@/assets/retry.svg';
import { Tooltip } from 'antd';
import { useStore } from 'zustand';
import { ArrowDownOutlined } from '@ant-design/icons';
import { msgStore, userStore } from '@/store';
import { messageContext } from './rootLayout';
import ScrollTrack from '../common/scrollTrack';
import DefaultButton from '../common/defaultButton';
import TextType from '../common/textType';
import XMarkdown from '@ant-design/x-markdown';

export default function MsgContent() {
	const msg = useStore(msgStore, (state) => state.msg);
	const id = useStore(msgStore, (state) => state.id);
	const generating = useStore(msgStore, (state) => state.generating);
	const getCurrentMsg = useStore(msgStore, (state) => state.getCurrentMsg);
	const messageApi = useContext(messageContext);
	const endRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const [scrollToBottomBtnVisible, setScrollToBottomBtnVisible] =
		useState<boolean>(false);

	useEffect(() => {
		const searchParam = window.location.search.split('msg=')[1];
		const searchId = id === '0' && searchParam ? searchParam : id;
		getCurrentMsg(searchId).then((res) => {
			if (!res.success) {
				messageApi.error('未找到该对话');
				return;
			}
		});
	}, []);

	useEffect(() => {
		const el = endRef.current;
		if (!el) return;
		const ro = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.intersectionRatio > 0) {
						setScrollToBottomBtnVisible(false);
					} else {
						setScrollToBottomBtnVisible(true);
					}
				});
			},
			{
				root: containerRef.current,
			},
		);

		ro.observe(el);
		return () => ro.disconnect();
	}, [id]);

	useEffect(() => {
		if (!contentRef.current) return;
		if (generating && endRef.current) {
			endRef.current.scrollIntoView({
				behavior: 'smooth',
			});
		}
	}, [generating]);

	return (
		<div className='relative flex-1 h-full bg-white px-16 flex flex-col justify-center items-center gap-8'>
			{id === '0' ? (
				<>
					<TextType
						className='text-gray-700 font-bold text-4xl'
						text={['今天过得如何？', '有什么想分享的吗？']}
					/>
					<Input />
				</>
			) : (
				<div className='relative flex-1 h-full w-[832px] pt-3 '>
					<div
						className='w-full h-full overflow-auto relative'
						ref={containerRef}
					>
						<div className='w-full flex flex-col' ref={contentRef}>
							{msg.map((msg, index) => {
								return (
									<div key={index}>
										{msg.role === 'user' ? (
											<div
												className={`pb-10 flex justify-end`}
												style={{
													paddingTop:
														index === 0 ? 0 : 48,
												}}
											>
												<div className='px-4 py-1.5 bg-[#C84444] text-white rounded-[18px]'>
													<span className='block max-w-[500px] text-[16px] leading-6'>
														{msg.content}
													</span>
												</div>
											</div>
										) : (
											<div className='flex flex-col'>
												{msg.loading ? (
													<div className='w-full h-80'>
														<div className='w-10 h-10 flex items-center justify-center'>
															<div className='breathPoint'></div>
														</div>
													</div>
												) : (
													<>
														<XMarkdown
															content={
																msg.content
															}
														/>
														{!generating && (
															<div className='py-2 flex gap-4'>
																<Tooltip
																	placement='bottom'
																	arrow={
																		false
																	}
																	title={
																		<span className='text-xs text-white'>
																			复制
																		</span>
																	}
																>
																	<img
																		className='hover:cursor-pointer'
																		src={
																			copyIcon
																		}
																		width={
																			16
																		}
																		alt=''
																	/>
																</Tooltip>
																<Tooltip
																	arrow={
																		false
																	}
																	placement='bottom'
																	title={
																		<span className='text-xs text-white'>
																			重试
																		</span>
																	}
																	className='hover:cursor-pointer'
																>
																	<img
																		className='hover:cursor-pointer'
																		src={
																			retryIcon
																		}
																		width={
																			12
																		}
																		alt=''
																	/>
																</Tooltip>
															</div>
														)}
													</>
												)}
											</div>
										)}
									</div>
								);
							})}
						</div>
						<div className='mt-60 w-full h-1' ref={endRef}></div>
						<ScrollTrack
							containerRef={
								containerRef as RefObject<HTMLDivElement>
							}
						/>
					</div>
					<div className='absolute z-10 bottom-8 left-0 w-full flex flex-col items-center gap-4'>
						{scrollToBottomBtnVisible && (
							<div
								className={`relative h-9 w-9 flex items-center justify-center rounded-[18px] bg-white shadow-xl hover:cursor-pointer ${
									generating ? '' : 'border border-[#D9D9D9]'
								}`}
								onClick={() => {
									endRef.current?.scrollIntoView({
										behavior: 'smooth',
									});
								}}
							>
								{generating && (
									<div className='absolute top-0 left-0 w-full h-full z-0 rounded-[18px] border-b border-[#C84444] generatingAround'></div>
								)}
								<ArrowDownOutlined />
							</div>
						)}
						<Input />
					</div>
				</div>
			)}
		</div>
	);
}

function Input() {
	const id = useStore(msgStore, (state) => state.id);
	const generating = useStore(msgStore, (state) => state.generating);
	const isLogin = useStore(userStore, (state) => state.isLogin);
	const sendMsg = useStore(msgStore, (state) => state.sendMsg);
	const createMsg = useStore(msgStore, (state) => state.createMsg);
	const [input, setInput] = useState<string>('');
	const inputRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const messageApi = useContext(messageContext);

	useEffect(() => {
		function handleBlur(e: FocusEvent) {
			const target = e.target as HTMLDivElement;
			if (target.innerText.trim().length === 0) {
				target.innerText = '';
			}
		}

		if (inputRef.current && containerRef.current) {
			inputRef.current.addEventListener('blur', handleBlur);
		}
		return () => {
			if (inputRef.current) {
				inputRef.current.removeEventListener('blur', handleBlur);
			}
		};
	}, []);

	function handleInputChange(e: React.ChangeEvent<HTMLDivElement>) {
		setInput(e.target.innerText);
	}

	async function handleSend() {
		if (input.trim().length === 0) return;
		setInput('');
		if (inputRef.current) {
			inputRef.current.innerText = '';
		}
		if (id === '0') {
			const { success, msg } = await createMsg();
			if (!success) {
				messageApi.error(msg);
				return;
			}
		}
		await sendMsg({
			role: 'user',
			content: input,
		});
	}

	useGSAP(() => {
		gsap.to('.container', {
			height:
				56 +
				((inputRef.current?.scrollHeight as number) - 24 > 96
					? 96
					: (inputRef.current?.scrollHeight as number) - 24),
			duration: 0.2,
		});
	}, [inputRef.current?.scrollHeight]);

	return (
		<div className='flex gap-2'>
			<div className='container relative w-3xl h-14 px-12 py-4 bg-white border border-[#D9D9D9] shadow-lg rounded-[28px] '>
				<div className='absolute bottom-7 left-7 -translate-x-1/2 translate-y-1/2 w-10 h-10 rounded-[20px] flex items-center justify-center hover:bg-[#D9D9D9] hover:cursor-pointer'>
					<img src={voiceIcon} width={24} alt='' />
				</div>
				<div
					className={`relative  ml-1 w-full max-h-30 overflow-auto ${
						!isLogin ? 'cursor-not-allowed' : ''
					}`}
					ref={containerRef}
				>
					<div
						contentEditable={true && isLogin}
						className='w-full focus:outline-none'
						ref={inputRef}
						onInput={handleInputChange}
						data-placeholder='您有什么话想倾诉嘛~'
					></div>
					<ScrollTrack
						containerRef={containerRef as RefObject<HTMLDivElement>}
					/>
				</div>
				<div className='absolute bottom-7 right-7 translate-x-1/2 translate-y-1/2 w-10 h-10 rounded-[20px] flex items-center justify-center hover:bg-[#D9D9D9] hover:cursor-pointer'>
					<img src={speakIcon} width={24} alt='' />
				</div>
			</div>
			<DefaultButton
				onClick={handleSend}
				className='self-end h-14 w-14 border border-[#C84444] shadow-xl rounded-[28px]'
				loading={generating || !isLogin}
			>
				<img src={arrowIcon} width={64} alt='' />
			</DefaultButton>
		</div>
	);
}
