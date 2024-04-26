import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { PublicKey, Transaction } from '@solana/web3.js';
import { transfer } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const SendTokenForm = ({ tokens }) => {
  const [selectedToken, setSelectedToken] = useState('');
  const [amountToSend, setAmountToSend] = useState('');
  const [destination, setDestination] = useState('');
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleTransfer = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet.');
      return;
    }

    const tokenPublicKey = new PublicKey(selectedToken);
    const destinationPublicKey = new PublicKey(destination);
    const sendAmount = parseInt(amountToSend);

    if (isNaN(sendAmount) || sendAmount <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }

    try {
      const transaction = new Transaction().add(
        transfer({
          source: await PublicKey.createWithSeed(publicKey, 'transfer', tokenPublicKey),
          destination: destinationPublicKey,
          amount: sendAmount,
          owner: publicKey,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');
      toast.success('Tokens sent successfully!');
    } catch (error) {
      console.error(error);
      toast.error(`Error sending tokens: ${error.message}`);
    }
  };

  return (
    <div className="send-token-form">
      <h2 className="text-2xl font-bold mb-4">Send Tokens</h2>
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
        value={amountToSend}
        onChange={(e) => setAmountToSend(e.target.value)}
        className="mb-4 p-2 border rounded"
        placeholder="Amount to Send"
      />
      <input
        type="text"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="mb-4 p-2 border rounded"
        placeholder="Destination Wallet Address"
      />
      <button onClick={handleTransfer} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Send
      </button>
    </div>
  );
};

export default SendTokenForm;
