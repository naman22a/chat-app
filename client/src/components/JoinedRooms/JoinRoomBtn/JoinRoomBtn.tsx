import React from 'react';
import { User } from '@/api/users/types';
import { useSocket } from '@/lib/socket';
import { HandleSubmit } from '@/interfaces';
import { notify, showError } from '@/utils';
import { Button, InputField } from '@/components';
import { Form, Formik } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { OkResponse } from '../../../api/types';
import { useRouter } from 'next/router';

const socket = useSocket();

const JoinRoomBtn: React.FC = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const handleJoinRoom: HandleSubmit<{ name: string }> = async (
        { name },
        { setErrors },
    ) => {
        try {
            // check if name is empty
            if (!name) {
                setErrors({ name: 'name is required' });
                return;
            }

            socket.emit(
                'join',
                { roomName: name },
                async (res: OkResponse & { data?: User }) => {
                    try {
                        if (res.ok && res.data && !res.errors) {
                            await queryClient.invalidateQueries([
                                'rooms',
                                'joined',
                            ]);
                            await router.push(`/rooms/${name}`);
                            notify('Joined new room');
                        } else if (res.errors) {
                            setErrors({ name: res.errors[0].message });
                        } else {
                            showError();
                        }
                    } catch (error) {
                        console.error(error);
                        showError();
                    }
                },
            );
        } catch (error) {
            console.error(error);
            showError();
        }
    };

    return (
        <div className="mt-5">
            <Formik initialValues={{ name: '' }} onSubmit={handleJoinRoom}>
                {({ isSubmitting }) => (
                    <Form className="flex flex-col items-start w-full md:w-1/2 lg:w-1/4">
                        <InputField name="name" label="Name" />
                        <Button
                            type="submit"
                            className="mt-2"
                            isLoading={isSubmitting}
                        >
                            Join a room
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default JoinRoomBtn;
