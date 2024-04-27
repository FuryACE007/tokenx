import '../styles/globals.css';
import { useMemo } from 'react';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import Navbar from '../components/Navbar';
import { UmiContext } from '../contexts/UmiContext';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

function MyApp({ Component, pageProps }) {
  // Setup the wallet providers
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  // Instantiate the Umi instance
  const umiInstance = useMemo(() => createUmi('https://devnet.helius-rpc.com/?api-key=7514a7bd-79b3-44f0-b42b-8db3c48038a7'), []);

  return (
    <UmiContext.Provider value={{ umi: umiInstance }}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Navbar />
          <Component {...pageProps} />
        </WalletModalProvider>
      </WalletProvider>
    </UmiContext.Provider>
  );
}

export default MyApp;
