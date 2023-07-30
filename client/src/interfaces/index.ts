import { FormikHelpers } from 'formik';

export type HandleSubmit<T> = (
    values: T,
    formikHelpers: FormikHelpers<T>,
) => void | Promise<any>;

export type LoginInputs = {
    usernameOrEmail: string;
    password: string;
};
