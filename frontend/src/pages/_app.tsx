import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { AppContext } from '../context/AppContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

import config from '../wagmi';

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
      <title>Arbinvader</title>
      <meta content="Arbinvader created by Nashki" name="description" />
      <link href="/favicon.ico" rel="icon" />
    </Head>
    
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <AppContext>
            <Header />
            <Component {...pageProps} />
            <Footer />
          </AppContext>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    </>
  );
}

export default MyApp;
