import React, { useState, useEffect } from 'react';
import CreateTokenForm from '../components/CreateTokenForm';
import MintTokenForm from '../components/MintTokenForm';
import SendTokenForm from '../components/SendTokenForm';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Connection } from '@solana/web3.js';

const TokenOperations = () => {
  const [activeForm, setActiveForm] = useState('');
  const [tokens, setTokens] = useState([]);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    if (publicKey) {
      // Fetch tokens for the connected wallet's publicKey
      console.log('Fetching tokens for publicKey:', publicKey.toBase58());
      // TODO: Implement the logic to fetch tokens from the blockchain
      // setTokens(fetchedTokens);
    }
  }, [publicKey, connection]);

  const handleButtonClick = (formName) => {
    setActiveForm(formName);
  };

  return (
    <div className="container mx-auto text-center">
      <h1 className="text-4xl font-bold my-8">Token Operations</h1>
      <div className="my-4">
        <button
          onClick={() => handleButtonClick('create')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2"
        >
          Create Token
        </button>
        <button
          onClick={() => handleButtonClick('mint')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
        >
          Mint Token
        </button>
        <button
          onClick={() => handleButtonClick('send')}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-2"
        >
          Send Token
        </button>
      </div>
      {activeForm === 'create' && <CreateTokenForm />}
      {activeForm === 'mint' && <MintTokenForm tokens={tokens} />}
      {activeForm === 'send' && <SendTokenForm />}
    </div>
  );
};

export default TokenOperations;
