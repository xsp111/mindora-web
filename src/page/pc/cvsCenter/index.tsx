import Sider from '@/components/pc/sider';
import ConversationContent from '@/components/pc/msgContent';
import './index.css';
import useCheckLoginState from '@/hooks/useCheckLoginState';

export default function CvsCenter() {
	const { fallback } = useCheckLoginState();
	if (fallback) {
		return fallback;
	}

	return (
		<div className='w-full h-full flex'>
			<Sider />
			<ConversationContent />
		</div>
	);
}
