import Sider from '@/components/pc/sider';
import ConversationContent from '@/components/pc/cvsContent';
import './index.css';
import useCheckLoginState from '@/hooks/useCheckLoginState';

export default function CvsCenter() {
	useCheckLoginState();

	return (
		<div className='w-full h-full flex'>
			<Sider />
			<ConversationContent />
		</div>
	);
}
