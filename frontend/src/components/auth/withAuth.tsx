import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from '../../context/AppContext';

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
    return function WithAuthComponent(props: P) {
        const router = useRouter();
        const { isConnected } = useAppContext();

        useEffect(() => {
        // Check if user is not authenticated
        if (!isConnected) {
            router.replace('/');
        }
        }, [isConnected, router]);

        if (!isConnected) {
        return (
            <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                <p className="mb-4">Please connect your wallet to access the page.</p>
            </div>
            </div>
        );
        }

        return <WrappedComponent {...props} />;
    };
};