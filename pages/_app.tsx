import '../styles/globals.css';
import type { AppProps } from 'next/app';
import {
  ChakraProvider,
  extendTheme,
  type ThemeConfig,
} from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';

import Layout from '../components/Layout';
import fetchAPI from '../utils/fetchAPI';

const config: ThemeConfig = {
  useSystemColorMode: false,
  initialColorMode: 'light',
};

const styles = {
  global: ({ colorMode }: { colorMode: 'light' | 'dark' }) =>
    colorMode === 'light'
      ? {
          body: {
            bg: '#EAEFF3',
          },
        }
      : {},
};

const theme = extendTheme({ config, styles });

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: fetchAPI,
        suspense: true,
      }}
    >
      <SessionProvider>
        <ChakraProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </SessionProvider>
    </SWRConfig>
  );
}
