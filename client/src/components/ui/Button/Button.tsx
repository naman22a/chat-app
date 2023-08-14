import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    isLoading?: boolean;
    textClassName?: string;
}

const Button: React.FC<Props> = (props) => {
    const {
        isLoading = false,
        children,
        className,
        textClassName,
        ...btnProps
    } = props;
    return (
        <button
            className={twMerge(
                'btn btn-primary normal-case',
                isLoading && 'cursor-not-allowed',
                isLoading && 'border-none bg-opacity-40 hover:bg-opacity-40',
                isLoading && ' no-animation',
                className,
            )}
            {...btnProps}
        >
            {isLoading && <span className="loading loading-spinner"></span>}
            <span className={twMerge('font-semibold text-lg', textClassName)}>
                {children}
            </span>
        </button>
    );
};

export default Button;
