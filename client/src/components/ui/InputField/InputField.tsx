import React, { InputHTMLAttributes } from 'react';
import { formatError } from '@/utils';
import { useField } from 'formik';
import { twMerge } from 'tailwind-merge';

type Props = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
};

const InputField: React.FC<Props> = ({ label, size: _, ...props }) => {
    const [field, { error }] = useField(props);

    return (
        <>
            <div className="form-control mb-5 w-full">
                <label className="label" htmlFor={field.name}>
                    <span className="label-text">{label}</span>
                </label>
                <input
                    {...field}
                    {...props}
                    id={field.name}
                    placeholder={props.placeholder ? props.placeholder : label}
                    autoComplete="off"
                    className={twMerge(
                        'input input-bordered',
                        error && 'input-error',
                    )}
                />
                {error && (
                    <p className="text-error text-sm mt-1 font-semibold">
                        {formatError(error)}
                    </p>
                )}
            </div>
        </>
    );
};

export default InputField;
