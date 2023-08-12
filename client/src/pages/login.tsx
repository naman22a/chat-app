import { NextPage } from 'next';
import { useRouter } from 'next/router';
import * as api from '@/api';
import { Button, InputField } from '@/components';
import { HandleSubmit, LoginInputs } from '@/interfaces';
import { mapToErrors, notify, showError } from '@/utils';
import { Formik, Form } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const Login: NextPage = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutateAsync: login } = useMutation(
        ['auth', 'login'],
        api.auth.login,
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['users', 'me']);
            },
        },
    );
    const handleSubmit: HandleSubmit<LoginInputs> = async (
        values,
        { setErrors },
    ) => {
        try {
            const res = await login(values);
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
                {({ isSubmitting }) => (
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
