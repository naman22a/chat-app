import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Room: NextPage = () => {
    const router = useRouter();
    const name = router.query.name as string;

    return (
        <div>
            <h1 className="text-4xl font-semibold mb-5">
                Room: <span className="text-accent">{name}</span>
            </h1>
        </div>
    );
};

export default Room;
