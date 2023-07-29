import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Layout } from '@/components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 1 } }
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Chat App</title>
            </Head>
            <QueryClientProvider client={queryClient}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </>
    );
}
