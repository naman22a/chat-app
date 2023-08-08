import { toast } from 'react-hot-toast';
import { FieldError } from '@/api/types';

export const mapToErrors = (errors: FieldError[]) => {
    const errorMap: Record<string, string> = {};

    for (const error of errors) {
        errorMap[error.field] = error.message;
    }

    return errorMap;
};

export const notify = (message: string) => {
    toast.success(message);
};

export const showError = (
    message: string = 'Opps! Something went wrong.\nPlease try again later.',
) => toast.error(message);
