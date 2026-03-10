import type { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface FormConfig {
	formClassName?: string;
	items: FormItemProps[];
}

interface FormItemProps
	extends InputHTMLAttributes<HTMLInputElement>, classNameExtend {
	label: string;
}

interface classNameExtend {
	labelClassName?: string;
	inputClassName?: string;
}

export default function DefaultForm({
	config,
}: {
	config: FormConfig & classNameExtend;
}) {
	const {
		formClassName,
		items,
		labelClassName: globalLabelClassName,
		inputClassName: globalInputClassName,
	} = config;
	return (
		<div className={twMerge('w-full flex flex-col gap-4', formClassName)}>
			{items.map((item) => (
				<FormItem
					key={item.name}
					{...item}
					labelClassName={twMerge(
						item.labelClassName || globalLabelClassName,
					)}
					inputClassName={twMerge(
						item.inputClassName || globalInputClassName,
					)}
				/>
			))}
		</div>
	);
}

function FormItem(
	props: FormItemProps & InputHTMLAttributes<HTMLInputElement>,
) {
	const { label, labelClassName, inputClassName, ...inputProps } = props;
	return (
		<>
			<div className='w-full'>
				<span
					className={twMerge('text-gray-700 text-xs', labelClassName)}
				>
					{label}
				</span>
				<DefaultInput {...inputProps} className={inputClassName} />
			</div>
		</>
	);
}

export function DefaultInput(props: InputHTMLAttributes<HTMLInputElement>) {
	const { className, ...inputProps } = props;
	return (
		<input
			{...inputProps}
			className={twMerge(
				'w-full mt-2 h-8 border-b border-gray-500 px-2 focus:outline-none focus:border-[#C84444]',
				className,
			)}
		/>
	);
}
