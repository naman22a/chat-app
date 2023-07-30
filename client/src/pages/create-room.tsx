import * as api from '@/api';
import { NextPage } from 'next';
import { Form, Formik } from 'formik';
import { Button, InputField } from '@/components';
import { useMutation } from '@tanstack/react-query';
import { notify } from '../utils';
import { useRouter } from 'next/router';
import Link from 'next/link';

const CreateRoom: NextPage = () => {
    const router = useRouter();
    const { mutateAsync: createRoom } = useMutation(
        ['rooms', 'create'],
        api.rooms.create,
    );
    return (
        <div>
            <h1 className="font-semibold text-4xl capitalize mb-4">
                create room
            </h1>

            <Formik
                initialValues={{ name: '' }}
                onSubmit={async (values, { setErrors }) => {
                    if (!values.name) {
                        setErrors({
                            name: 'name is required',
                        });
                        return;
                    }

                    const room = await createRoom(values.name);

                    console.log(room);
                    if (!room) {
                        setErrors({
                            name: 'room name is already taken, please try a different name',
                        });
                        return;
                    }

                    notify('Room created');
                    router.push('/');
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="flex flex-col items-start w-full md:w-1/2 lg:w-1/3">
                        <InputField name="name" label="Name" />
                        <p className="text-slate-400 mb-3">
                            The room name should be all lowercase and should not
                            contain any spaces you can use hyphen(-) to seprate
                            words in room name. e.g: "
                            <span className="text-accent">rubiks-cube</span>"
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="..">
                                <Button>Cancel</Button>
                            </Link>
                            <Button
                                isLoading={isSubmitting}
                                type="submit"
                                className="btn-secondary"
                            >
                                Create room
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default CreateRoom;