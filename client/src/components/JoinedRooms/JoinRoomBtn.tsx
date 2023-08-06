import React from 'react';
import * as api from '@/api';
import { Button, InputField } from '@/components';
import { Form, Formik } from 'formik';
import { HandleSubmit } from '../../interfaces';
import { socket } from '../../lib/socket';
import { User } from '../../api/users/types';
import { notify, showError } from '../../utils';
import { useQuery } from '@tanstack/react-query';

const JoinRoomBtn: React.FC = () => {
    const { data: rooms } = useQuery(['rooms', 'joined'], api.rooms.joined);
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

            // check if name exists
            let nameExists = false;
            socket!.emit('join', { roomName: name }, (user: User | null) => {
                if (!user) {
                    nameExists = true;
                }
            });
            if (!nameExists) {
                setErrors({ name: 'room name not found' });
                return;
            }

            // check if room already joined
            const alreadyJoinedRoom = rooms?.find((r) => r.name === name);
            if (alreadyJoinedRoom) {
                setErrors({ name: 'room name already joined' });
                return;
            }

            notify('Joined new room');
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
