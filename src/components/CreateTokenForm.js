import React, { useState, useRef, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';
import { createFungible } from '@metaplex-foundation/mpl-token-metadata';
import { toast } from 'react-toastify';
import { Umi, createUmi } from '@metaplex-foundation/umi';
import { ProgramRepository } from '../contexts/ProgramRepository'; // Import the ProgramRepository

// Function to simulate metadata upload to Arweave and return the URI
async function uploadMetadataToArweave(metadata) {
  try {
    // Simulated metadata upload logic
    // In a real-world scenario, you would use Arweave SDK or similar to upload the metadata
    // For the purpose of this task, we will simulate a successful upload with a unique URI based on the metadata content
    const simulatedUri = `https://arweave.net/simulated_uri_for_${encodeURIComponent(metadata.name)}_${Date.now()}`;
    console.log(`Metadata uploaded to Arweave at URI: ${simulatedUri}`);
    return simulatedUri;
  } catch (error) {
    console.error('Failed to upload metadata to Arweave:', error);
    throw new Error('Failed to upload metadata.');
  }
}

const CreateTokenForm = () => {
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [initialSupply, setInitialSupply] = useState('');
  const umiRef = useRef(null);

  useEffect(() => {
    // Initialize Umi instance
    const umi = createUmi(clusterApiUrl('devnet'));
    console.log('Umi instance:', umi); // Log the Umi instance

    // Manually initialize the context if it's not already set by createUmi
    if (!umi.context) {
      umi.context = {};
    }

    // Ensure the Umi context is correctly set with the ProgramRepository
    if (!umi.context.programs) {
      umi.context.programs = new ProgramRepository();
    }
    console.log('Umi context after setting programs:', umi.context); // Log the Umi context

    // Assign the Umi instance to the ref
    umiRef.current = umi;

    // Cleanup function if needed for component unmount
    return () => {
      // Perform any cleanup operations
      umiRef.current = null;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Connect to the cluster
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

      // Generate a new keypair for the mint
      const mint = Keypair.generate();

      // Prepare the token metadata
      const metadata = {
        updateAuthority: mint.publicKey,
        mint: mint.publicKey,
        data: {
          name: tokenName,
          symbol: tokenSymbol,
          uri: '', // URI will be set after uploading to Arweave
          sellerFeeBasisPoints: 500, // 5%
          creators: null,
        },
      };

      // Upload the token metadata and get the URI
      const metadataUri = await uploadMetadataToArweave(metadata.data);

      // Update metadata with the actual URI
      metadata.data.uri = metadataUri;

      // Log the Umi context programs property before creating the fungible token
      console.log('Umi context programs property before createFungible:', umiRef.current.context.programs);
      if (!umiRef.current.context.programs) {
        console.error('Programs property is not set in the Umi context.');
        throw new Error('Programs property is not set in the Umi context.');
      }

      // Create the fungible token
      await createFungible(umiRef.current, {
        mint: mint.publicKey,
        name: metadata.data.name,
        symbol: metadata.data.symbol,
        uri: metadata.data.uri,
        sellerFeeBasisPoints: metadata.data.sellerFeeBasisPoints,
        isMutable: true,
        creators: metadata.data.creators,
        payer: umiRef.current.identity, // Use umi.identity as the payer
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
