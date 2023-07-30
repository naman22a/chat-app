import { NextPage } from 'next';
import * as api from '@/api';
import { Formik, Form } from 'formik';
import { Button, InputField } from '@/components';
import { HandleSubmit, LoginInputs } from '@/interfaces';
import { useMutation } from '@tanstack/react-query';
import { mapToErrors, notify, showError } from '../utils';
import { useRouter } from 'next/router';

const Login: NextPage = () => {
    const router = useRouter();
    const { mutateAsync: login } = useMutation(
        ['auth', 'login'],
        api.auth.login,
    );
    const handleSubmit: HandleSubmit<LoginInputs> = async (
        values,
        { setErrors },
    ) => {
        try {
            const res = await login(values);
            console.log(res);
            if (res.ok && !res.errors) {
                notify('Logged In');
                router.push('/');
            } else if (res.errors) {
                setErrors(mapToErrors(res.errors));
            } else {
                showError();
            }
        } catch (error) {
            console.error(error);
            showError();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="font-semibold text-4xl capitalize mb-4">login</h1>
            <Formik
                initialValues={
                    {
                        usernameOrEmail: '',
                        password: '',
                    } satisfies LoginInputs
                }
                onSubmit={handleSubmit}
            >
                {({ values, isSubmitting }) => (
                    <Form className="flex flex-col w-full md:w-1/2 lg:w-1/4">
                        <InputField
                            name="usernameOrEmail"
                            label="Username or Email"
                        />
                        <InputField
                            name="password"
                            label="Password"
                            type="password"
                        />
                        <Button type="submit" isLoading={isSubmitting}>
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Login;
