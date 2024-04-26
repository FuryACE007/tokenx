import React, { useState, useEffect, useMemo } from 'react';
import CreateTokenForm from '../components/CreateTokenForm';
import MintTokenForm from '../components/MintTokenForm';
import SendTokenForm from '../components/SendTokenForm';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Connection } from '@solana/web3.js';

const TokenOperations = () => {
  const [activeForm, setActiveForm] = useState('');
  // Simulate fetched tokens with mock data
  const [tokens, setTokens] = useState([
    {
      address: 'MockTokenAddress1',
      balance: '100',
      name: 'MockToken1',
      symbol: 'MTK1'
    },
    {
      address: 'MockTokenAddress2',
      balance: '200',
      name: 'MockToken2',
      symbol: 'MTK2'
    }
  ]);
  const { connection } = useConnection();
  // Simulate a connected wallet with a mock publicKey
  const mockPublicKey = useMemo(() => new PublicKey('BpfQjQyFJG8Uc1jRZcX1sDf9E1hphz6GH8DqUnR5dZXE'), []);

  useEffect(() => {
    // Simulate fetching tokens for the publicKey
    console.log('Simulating fetchTokens for publicKey:', mockPublicKey.toBase58());
    // Normally, you would fetch tokens from the blockchain
    // For simulation purposes, we're using the mock data provided above
  }, [mockPublicKey, connection]);

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
