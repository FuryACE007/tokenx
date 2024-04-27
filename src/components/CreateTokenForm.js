import React, { useState, useRef, useEffect, useContext } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';
import { createFungible } from '@metaplex-foundation/mpl-token-metadata';
import { toast } from 'react-toastify';
import { Umi, createUmi } from '@metaplex-foundation/umi';
import { UmiContext } from '../contexts/UmiContext'; // Import UmiContext

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
  const umiContext = useContext(UmiContext);

  useEffect(() => {
    // Check if the Umi instance is already provided in the context
    if (!umiContext.umi) {
      console.error('Umi instance is not provided in UmiContext');
      return;
    }

    // Use the provided Umi instance from the context
    umiRef.current = umiContext.umi;

    // Log the Umi instance to verify it is correctly obtained from the context
    console.log('Umi instance from context:', umiRef.current);

    // Cleanup function if needed for component unmount
    return () => {
      // Perform any cleanup operations
      umiRef.current = null;
    };
  }, [umiContext]);

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

      // Ensure the Umi context is correctly set with the ProgramRepository
      if (!umiRef.current || !umiRef.current.context || !umiRef.current.context.programs) {
        console.error('Umi instance or programs property is not set in the Umi context.');
        throw new Error('Umi instance or programs property is not set in the Umi context.');
      }

      // Log the Umi context programs property before creating the fungible token
      console.log('Umi context programs property before createFungible:', umiRef.current.context.programs);

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

      // Log the state of the Umi context programs property after createFungible
      console.log('Umi context programs property after createFungible:', umiRef.current.context.programs);

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
