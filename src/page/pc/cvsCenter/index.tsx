import Sider from '@/components/pc/sider';
import MsgContent from '@/components/pc/msgContent';
import './index.css';

export default function CvsCenter() {
	return (
		<div className='w-full h-full flex'>
			<Sider />
			<MsgContent />
		</div>
	);
}
