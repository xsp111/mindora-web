const ModalStatus = {
	CLOSE: 0,
	SETTINGS: 1,
	ASSESSMENT: 2,
	PRIVACY: 3,
};

type ModalStatusType = (typeof ModalStatus)[keyof typeof ModalStatus];

const AssessmentInfoitems = [
	{
		image: '/assessment1.jpg',
		link: 'https://google.com/',
		title: '情绪效价',
		description: `它看的是您的整体情绪是偏积极还是偏低落；范围：-1 → 1，当接近 -1时，您的情绪偏低，如压抑、难受、疲惫；
当接近 0时，您的情绪中性或波动较小；
当接近 1时，您的情绪偏积极，如轻松、愉快、满足；
它反映的是“情绪方向”，而不是强度。
有些时候情绪偏低是正常的，这个指标只是帮助你看到变化趋势。`,
	},
	{
		image: '/assessment2.jpg',
		link: 'https://google.com/',
		title: '唤醒度',
		description: `它看的是您的情绪“激活程度”，也可以理解为内在紧张或兴奋的水平。范围：0 → 1：
当接近 0时，状态较低，如无力、麻木、提不起劲；
如果唤醒度在中间区间，状态相对平稳；
当接近 1时，状态较高，如紧张、焦虑、激动；
高唤醒不一定是坏事，例如兴奋或专注时也会较高；
关键在于是否让您感到失控或不适。`,
	},
	{
		image: '/assessment3.jpg',
		link: 'https://google.com/',
		title: '压力负荷',
		description: `它看的是您当前感受到的现实压力程度。
范围：0 → 1：
当接近 0时，压力较低；
当接近 1时，压力较高，如任务密集、持续紧绷；
它关注的是您感受到的压力，而不是客观事件本身。
同样的情况，不同人可能体验完全不同。`,
	},
	{
		image: '/assessment4.jpg',
		link: 'https://google.com/',
		title: '认知扭曲',
		description: `它看的是您在思考问题时，是否容易出现某些“偏差思维模式”。范围：0 → 1，
接近 0时：思维较平衡、灵活；
接近 1时：更容易出现偏向性的思考方式；
常见表现包括：把事情往最坏情况想灾难化；
过度自责；
以偏概全，一次失败就想着“我总是失败”；
非黑即白；
这些思维方式在压力下很常见，并不代表问题。
这个指标只是帮助您觉察，而不是否定您的想法。`,
	},
	{
		image: '/assessment5.jpg',
		link: 'https://google.com/',
		title: '调节能力',
		description: `它看的是您在情绪波动时，恢复或调整自己的能力。范围：0 → 1：
接近 0：较难从情绪中恢复；
接近 1：能够逐步调整、缓解情绪。
这不是“你强不强”，而是反映你当下是否有足够资源比如精力、环境、支持来应对情绪。`,
	},
	{
		image: '/assessment6.jpg',
		link: 'https://google.com/',
		title: '风险等级',
		description: `它看的是您当前是否存在需要额外关注的心理风险信号。
取值范围：0 – 100%：
25%：无明显风险；
50%：轻度风险，如持续低落、无助感；
75%：中度风险，如明显退缩、强烈消极感；
100%：高风险，如出现自我伤害相关表达；
这个指标用于帮助系统判断是否需要提供更多支持或建议。
它不是诊断结果，也不代表您有问题。`,
	},
];

const SettingsItems = [
	{
		id: 'gentle',
		name: '温和体贴',
		deDesc: '更专业，事实性更强',
		enhanceDesc: '更友好，更亲近',
	},
	{
		id: 'passion',
		name: '热情洋溢',
		deDesc: '更加冷静中立',
		enhanceDesc: '更加活力充沛',
	},
	{
		id: 'titleAndList',
		name: '标题和列表',
		deDesc: '回复时使用更多的段落',
		enhanceDesc: '回复时采用清晰格式与列表结构',
	},
	{
		id: 'emoji',
		name: '表情符号',
		deDesc: '尽量少使用表情符号',
		enhanceDesc: '更多使用表情符号',
	},
];

const StyleItems = [
	{
		label: '默认',
		value: 0,
	},
	{
		label: '专业可靠',
		value: 1,
	},
	{
		label: '亲和友善',
		value: 2,
	},
	{
		label: '直言不讳',
		value: 3,
	},
	{
		label: '天马行空',
		value: 4,
	},
	{
		label: '吐槽达人',
		value: 5,
	},
];

export {
	ModalStatus,
	SettingsItems,
	StyleItems,
	type ModalStatusType,
	AssessmentInfoitems,
};
