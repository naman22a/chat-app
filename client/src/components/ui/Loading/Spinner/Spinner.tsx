import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
    type?: 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity';
    size?: 'xs' | 'sm' | 'md' | 'lg';
}

const _possible_types_classes = [
    'loading-spinner',
    'loading-dots',
    'loading-ring',
    'loading-ball',
    'loading-bars',
    'loading-infinity',
];

const _possible_sizs_classes = [
    'loading-xs',
    'loading-sm',
    'loading-md',
    'loading-lg',
];

const Spinner: React.FC<Props> = (props) => {
    const { type = 'dots', size = 'md' } = props;
    return (
        <span
            className={twMerge(
                'loading text-accent w-20',
                `loading-${type} loading-${size}`,
            )}
        ></span>
    );
};

export default Spinner;
