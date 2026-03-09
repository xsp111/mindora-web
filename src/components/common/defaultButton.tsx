import { LoadingOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export type DefaultButtonProp = {
	children?: ReactNode;
	className?: string;
	onClick?: () => void;
	loading?: boolean;
};

export default function DefaultButton(props: DefaultButtonProp) {
	const { children, className, onClick, loading = false } = props;
	return (
		<button
			className={twMerge(
				`flex justify-center items-center px-4 py-1.5 rounded-md border text-sm font-bold bg-[#C84444] text-white   transition-all duration-200`,
				className,
				loading
					? 'bg-gray-100 text-gray-700 border-none hover:cursor-not-allowed'
					: 'hover:cursor-pointer hover:bg-[#ff9b9b]',
			)}
			onClick={onClick}
			disabled={loading}
		>
			{loading ? <LoadingOutlined /> : children}
		</button>
	);
}
