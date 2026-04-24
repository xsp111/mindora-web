import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Card({
	children,
	className,
}: {
	children?: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={twMerge(
				'w-full h-full rounded-3xl shadow-[0_0_10px_rgba(0,0,0,0.1)] bg-white p-4',
				className,
			)}
		>
			{children}
		</div>
	);
}
