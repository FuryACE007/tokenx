import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletModalButton } from '@solana/wallet-adapter-react-ui';

const Navbar = () => {
  const { publicKey } = useWallet();

  return (
    <nav className="flex justify-between items-center p-4">
      <p className="text-2xl font-bold">TokenX</p>
      {publicKey ? (
        <button className="wallet-button">
          {publicKey.toString().slice(0, 4) + '...' + publicKey.toString().slice(-4)}
        </button>
      ) : (
        <WalletModalButton className="wallet-button">Connect Wallet</WalletModalButton>
      )}
    </nav>
  );
};

export default Navbar;
