import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4">
      <p className="text-2xl font-bold">TokenX</p>
      <WalletMultiButton />
    </nav>
  );
};

export default Navbar;
