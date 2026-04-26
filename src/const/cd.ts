import emo from '../assets/intro-emo.svg';
import health from '../assets/intro.health.svg';
import guide from '../assets/intro-guide.svg';

const CD = {
	homePageTypeText: [
		'与 Mindora 对话',
		'心理支持，认知引导',
		'分享情感，情绪支撑',
	],
	homePageLoopText:
		'EMBARRASSMENT ENNUI ANXIETY ENVY SADNESS DISGUST JOY ANGER FEAR',
	LoopColor: [
		'#FFDAD5',
		'#D5E7FF',
		'#FFE8D5',
		'#D5FFF1',
		'#D5F2FF',
		'#E1FFD5',
		'#FFFFD5',
		'#FFD5D5',
		'#F9D5FF',
	],
	homePageSubTitle: '您的 AI 心理支持与认知引导助手',
	homePageDescText:
		'在情绪波动、压力累积或思绪混乱的时刻， Mindora\n ' +
		'通过科学的心理模型与多模态交互，' +
		'帮助您稳定情绪、澄清认知、识别心理风险，随时为您提供更接近心理专业人士的支持体验。',
	homePageWhatCanDoDesc: [
		{
			title: '情绪安抚',
			desc: `当焦虑、低落、烦躁出现时，\nMindora 通过语言节奏、语音引导与视觉暗示，\n帮助你恢复心理稳定感，避免情绪失控与过度内耗。`,
			icon: health,
		},
		{
			title: '认知引导',
			desc: `Mindora 不只是倾听，更会引导你：\n识别思维偏差，重构消极认知，将混乱的情绪转化为可理解、可行动的状态\n这是基于现代心理学与认知行为模型的系统化引导，而非泛泛安慰。`,
			icon: guide,
		},
		{
			title: '心理健康评估',
			desc: `通过对话与结构化分析，Mindora 可以辅助识别心理压力水平与潜在风险信号，\n并在必要时，温和地提示你考虑寻求专业帮助。\nMindora 不替代心理医生，但能帮助你更早觉察、理清与应对。`,
			icon: emo,
		},
	],
};
export default CD;
