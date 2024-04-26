import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { PublicKey, Transaction } from '@solana/web3.js';
import { mintTo, getMint } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const MintTokenForm = ({ tokens }) => {
  const [selectedToken, setSelectedToken] = useState('');
  const [amountToMint, setAmountToMint] = useState('');
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleMint = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet.');
      return;
    }

    const mintPublicKey = new PublicKey(selectedToken);
    const mintAmount = parseInt(amountToMint);

    if (isNaN(mintAmount) || mintAmount <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }

    try {
      const mintInfo = await getMint(connection, mintPublicKey);
      const transaction = new Transaction().add(
        mintTo({
          mint: mintPublicKey,
          destination: await PublicKey.createWithSeed(publicKey, 'mint', mintPublicKey),
          amount: mintAmount,
          mintAuthority: publicKey,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');
      toast.success('Tokens minted successfully!');
    } catch (error) {
      console.error(error);
      toast.error(`Error minting tokens: ${error.message}`);
    }
  };

  return (
    <div className="mint-token-form">
      <h2 className="text-2xl font-bold mb-4">Mint Tokens</h2>
      <select
        value={selectedToken}
        onChange={(e) => setSelectedToken(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="">Select a token</option>
        {tokens.map((token) => (
          <option key={token.address} value={token.address}>
            {token.name} ({token.symbol})
          </option>
        ))}
      </select>
      <input
        type="number"
        value={amountToMint}
        onChange={(e) => setAmountToMint(e.target.value)}
        className="mb-4 p-2 border rounded"
        placeholder="Amount to Mint"
      />
      <button onClick={handleMint} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Mint
      </button>
    </div>
  );
};

export default MintTokenForm;
