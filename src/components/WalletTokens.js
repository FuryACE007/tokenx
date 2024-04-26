import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { fetchAllDigitalAssetByOwner, getAssociatedTokenAddress, getTokenAccountBalance } from '@metaplex-foundation/mpl-token-metadata';

const WalletTokens = () => {
  const { publicKey } = useWallet();
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!publicKey) return;

      try {
        const connection = new Connection('https://devnet.helius-rpc.com/?api-key=7514a7bd-79b3-44f0-b42b-8db3c48038a7');
        const assets = await fetchAllDigitalAssetByOwner({ connection, owner: publicKey });

        const tokenDetails = await Promise.all(assets.map(async (asset) => {
          const tokenAddress = await getAssociatedTokenAddress(new PublicKey(asset.mint), publicKey);
          const balance = await getTokenAccountBalance(connection, tokenAddress);
          return {
            name: asset.name,
            symbol: asset.symbol,
            balance: balance.value.uiAmountString,
          };
        }));

        setTokens(tokenDetails);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
    };

    fetchTokens();
  }, [publicKey]);

  if (!publicKey) {
    return <p>Please connect your wallet to view tokens.</p>;
  }

  return (
    <div>
      <h3>Your Tokens</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Symbol</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, index) => (
            <tr key={index}>
              <td>{token.name}</td>
              <td>{token.symbol}</td>
              <td>{token.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WalletTokens;
