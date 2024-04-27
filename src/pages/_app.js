import '../styles/globals.css';
import { useMemo } from 'react';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import Navbar from '../components/Navbar';
import { UmiContext } from '../contexts/UmiContext';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { ProgramRepository } from '../contexts/ProgramRepository';
import { Keypair } from '@solana/web3.js';

function MyApp({ Component, pageProps }) {
  // Setup the wallet providers
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  // Instantiate the Umi instance
  const umiInstance = useMemo(() => {
    // Create a new random keypair for the signer
    const signer = Keypair.generate();

    const umi = createUmi('https://devnet.helius-rpc.com/?api-key=7514a7bd-79b3-44f0-b42b-8db3c48038a7');
    // Set the signer identity for the Umi instance
    umi.identity = signer;

    // Assuming ProgramRepository is a class that needs to be instantiated
    // and that it requires the umi instance as a parameter
    const programRepository = new ProgramRepository(umi);
    umi.context = { programs: programRepository };
    return umi;
  }, []);

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
