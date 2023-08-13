import React from 'react';
import { User } from '@/api/users/types';
import { useSocket } from '@/lib/socket';
import { HandleSubmit } from '@/interfaces';
import { notify, showError } from '@/utils';
import { Button, InputField } from '@/components';
import { Form, Formik } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { OkResponse } from '../../../api/types';

const socket = useSocket('chat');

const JoinRoomBtn: React.FC = () => {
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

            socket!.emit(
                'join',
                { roomName: name },
                (res: OkResponse & { data?: User }) => {
                    if (res.ok && res.data && !res.errors) {
                        notify('Joined new room');
                    } else if (res.errors) {
                        setErrors({ name: res.errors[0].message });
                    } else {
                        showError();
                    }
                },
            );

            await queryClient.invalidateQueries(['rooms', 'joined']);
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
