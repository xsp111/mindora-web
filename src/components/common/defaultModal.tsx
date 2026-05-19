import { Modal, type ModalProps } from 'antd';

export default function DefaultModal(props: ModalProps) {
	const { children, ...restProps } = props;
	return (
		<Modal
			destroyOnHidden
			centered
			footer={null}
			maskClosable={false}
			{...restProps}
		>
			{children}
		</Modal>
	);
}
