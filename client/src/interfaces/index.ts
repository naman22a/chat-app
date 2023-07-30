import { FormikHelpers } from 'formik';

export type HandleSubmit<T> = (
    values: T,
    formikHelpers: FormikHelpers<T>,
) => void | Promise<any>;

export type LoginInputs = {
    usernameOrEmail: string;
    password: string;
};

export type RegisterInputs = {
    username: string;
    email: string;
    password: string;
    cpassword: string;
};
