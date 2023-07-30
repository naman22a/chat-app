import { NextPage } from 'next';
import * as api from '@/api';
import { Button, InputField } from '@/components';
import { mapToErrors, notify, showError } from '@/utils';
import { HandleSubmit, RegisterInputs } from '@/interfaces';
import { Form, Formik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';

const Register: NextPage = () => {
    const router = useRouter();
    const { mutateAsync: register } = useMutation(
        ['auth', 'register'],
        api.auth.register,
    );
    const handleSubmit: HandleSubmit<RegisterInputs> = async (
        values,
        { setErrors },
    ) => {
        const { username, email, password, cpassword } = values;

        if (password !== cpassword) {
            setErrors({
                password: 'passwords must be same',
                cpassword: 'passwords must be same',
            });
            return;
        }

        try {
            const res = await register({ username, email, password });

            if (res.ok && !res.errors) {
                notify('Account created successfully,\nNow you can login.');
                router.push('/login');
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
            <h1 className="font-semibold text-4xl capitalize mb-4">register</h1>
            <Formik
                initialValues={
                    {
                        username: '',
                        email: '',
                        password: '',
                        cpassword: '',
                    } satisfies RegisterInputs
                }
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="flex flex-col w-full md:w-1/2 lg:w-1/4">
                        <InputField name="username" label="Username" />
                        <InputField name="email" label="Email" type="email" />
                        <InputField
                            name="password"
                            label="Password"
                            type="password"
                        />
                        <InputField
                            name="cpassword"
                            label="Confirm Password"
                            type="password"
                        />
                        <Button isLoading={isSubmitting}>Register</Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Register;
