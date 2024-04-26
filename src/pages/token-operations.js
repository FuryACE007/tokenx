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
    const fetchTokens = async () => {
      if (publicKey) {
        try {
          console.log('Fetching tokens for publicKey:', publicKey.toBase58());
          const accounts = await connection.getParsedProgramAccounts(
            TOKEN_PROGRAM_ID,
            {
              filters: [
                {
                  dataSize: 165, // The size of SPL Token accounts
                },
                {
                  memcmp: {
                    offset: 32, // Offset to the start of the mint address
                    bytes: publicKey.toBase58(), // Your base58-encoded wallet address
                  },
                },
              ],
            }
          );
          console.log('Fetched accounts:', accounts);
          const tokensData = accounts.map((account) => {
            const { mint, tokenAmount } = account.account.data.parsed.info;
            return {
              address: mint,
              balance: tokenAmount.uiAmountString,
              // Placeholder for name and symbol as they require additional metadata fetching
              name: `Token at ${mint.toString().slice(0, 4)}...${mint.toString().slice(-4)}`,
              symbol: '???',
            };
          });
          console.log('Mapped tokens data:', tokensData);
          setTokens(tokensData);
        } catch (error) {
          console.error('Error fetching tokens:', error);
        }
      } else {
        console.log('Public key is not available. Wallet might not be connected.');
      }
    };

    fetchTokens();
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
