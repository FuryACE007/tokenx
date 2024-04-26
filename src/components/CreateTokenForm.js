import React, { useState } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';
import { createFungible } from '@metaplex-foundation/mpl-token-metadata';
import { toast } from 'react-toastify';

// Mock function to simulate metadata upload and return a URI
// This should be replaced with actual logic to upload metadata to a hosting service
async function uploadMetadata(tokenName, tokenSymbol) {
  // Simulate a delay for the upload process
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Return a mock URI
  return `https://example.com/metadata/${encodeURIComponent(tokenName)}-${encodeURIComponent(tokenSymbol)}.json`;
}

const CreateTokenForm = () => {
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [initialSupply, setInitialSupply] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Connect to the cluster
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

      // Generate a new keypair for the mint
      const mint = Keypair.generate();

      // Upload the token metadata and get the URI
      const metadataUri = await uploadMetadata(tokenName, tokenSymbol);

      // Create the fungible token
      await createFungible(connection, {
        mint: mint.publicKey,
        name: tokenName,
        symbol: tokenSymbol,
        uri: metadataUri,
        sellerFeeBasisPoints: 500, // 5%
        isMutable: true,
        creators: null,
        payer: mint,
      });

      toast.success('Token created successfully!');
      console.log('Token creation submitted:', { tokenName, tokenSymbol, initialSupply, mint: mint.publicKey.toString() });
    } catch (error) {
      console.error('Error creating token:', error);
      toast.error('Failed to create token.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Token Name"
        value={tokenName}
        onChange={(e) => setTokenName(e.target.value)}
        required
        className="p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Token Symbol"
        value={tokenSymbol}
        onChange={(e) => setTokenSymbol(e.target.value)}
        required
        className="p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Initial Supply"
        value={initialSupply}
        onChange={(e) => setInitialSupply(e.target.value)}
        required
        className="p-2 border rounded"
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Create Token
      </button>
    </form>
  );
};

export default CreateTokenForm;
