import { messageContext } from '@/components/pc/rootLayout';
import { useContext } from 'react';

const messageQueue: {
	type: 'error' | 'warning' | 'success';
	msg: string;
}[] = [];
let hasOtherMessageShowNow = false;

export default function useSingleMessageApiCall() {
	const messageApi = useContext(messageContext);

	const showDuration = 2;

	function exec({
		type,
		msg,
	}: {
		type: 'error' | 'warning' | 'success';
		msg: string;
	}) {
		console.log(
			'message call',
			msg,
			'hasOtherMessageShowNow',
			hasOtherMessageShowNow,
		);
		if (!hasOtherMessageShowNow) {
			hasOtherMessageShowNow = true;
			messageApi.open({
				type,
				content: msg,
				duration: showDuration,
			});
			const timer = setTimeout(() => {
				console.log('time exec');
				hasOtherMessageShowNow = false;
				if (messageQueue.length > 0) {
					const next = messageQueue.shift() as {
						type: 'error' | 'warning' | 'success';
						msg: string;
					};
					exec(next);
				}
				clearInterval(timer);
			}, showDuration * 1000);
		} else {
			messageQueue.push({ type, msg });
		}
	}

	return {
		error: (msg: string) => {
			exec({ type: 'error', msg });
		},
		warning: (msg: string) => {
			exec({ type: 'warning', msg });
		},
		success: (msg: string) => {
			exec({ type: 'success', msg });
		},
	};
}
