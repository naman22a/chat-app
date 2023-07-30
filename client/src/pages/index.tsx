import { NextPage } from 'next';
import { IsAuth } from '@/components';

const Index: NextPage = () => {
    return <div>Chat app</div>;
};

export default IsAuth(Index);
