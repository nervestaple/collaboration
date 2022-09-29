import '../styles/globals.css';
import type { AppProps } from 'next/app';
import {
  ChakraProvider,
  extendTheme,
  type ThemeConfig,
} from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';

import Layout from '../components/Layout';
import { SWRConfig } from 'swr';

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
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
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
