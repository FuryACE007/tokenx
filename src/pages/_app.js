import '../styles/globals.css';
import { useMemo } from 'react';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import Navbar from '../components/Navbar';
import { UmiContext } from '../contexts/UmiContext';
import { Umi } from '@metaplex-foundation/umi';

function MyApp({ Component, pageProps }) {
  // Setup the wallet providers
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  // Instantiate the Umi instance
  const umiInstance = useMemo(() => new Umi(), []);

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
