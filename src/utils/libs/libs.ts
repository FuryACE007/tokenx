/**
 * TokenX Utility Library
 *
 * This library contains utility functions for creating and managing tokens on the Solana blockchain.
 * It includes functions for creating fungible tokens, minting tokens, and more.
 *
 * Contributor: Sudhanshu Shekhar
 * Date of Contribution: 2024-04-19
 */

import {
  AccountLayout,
  TOKEN_PROGRAM_ID,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
} from "@solana/spl-token";
import { Connection, Keypair, PublicKey, Signer } from "@solana/web3.js";

/**
 * Creates a new fungible token on the Solana blockchain.
 * @param {Connection} connection - The connection to the Solana blockchain.
 * @param {Signer} payer - The payer's keypair.
 * @param {PublicKey} mintAuthority - The public key of the mint authority.
 * @param {number} decimals - The number of decimals for the token.
 * @returns {Promise<PublicKey>} - A promise that resolves to the public key of the newly created mint.
 */
export async function createFungibleToken(
  connection: Connection,
  payer: Signer,
  mintAuthority: PublicKey,
  decimals: number
): Promise<PublicKey> {
  const mint = createMint(connection, payer, mintAuthority, null, decimals);

  return await mint;
}

/**
 * Mints new tokens to a specified account.
 * @param {Connection} connection - The connection to the Solana blockchain.
 * @param {Signer} payer - The payer's keypair.
 * @param {PublicKey} mint - The public key of the mint.
 * @returns {Promise<void>} - A promise that resolves when the minting is complete.
 */
export async function mintTokens(
  connection: Connection,
  payer: Signer,
  mint: PublicKey
): Promise<void> {
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    new PublicKey(payer.publicKey)
  );

  console.log("Token Account: ", tokenAccount.address.toBase58());
  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    new PublicKey(payer.publicKey),
    100000000000 // because decimals for the mint are set to 9
  );
}

/**
 * Retrieves information about all tokens owned by a specific public key.
 * @param {Connection} connection - The connection to the Solana blockchain.
 * @param {PublicKey} owner - The public key of the owner whose tokens are to be retrieved.
 * @returns {Promise<void>} - A promise that resolves when the token information retrieval is complete.
 */
export async function getAllOwnedTokenInfo(
  connection: Connection,
  owner: PublicKey
): Promise<void> {
  const tokenAccounts = await connection.getTokenAccountsByOwner(
    new PublicKey("8YLKoCu7NwqHNS8GzuvA2ibsvLrsg22YMfMDafxh1B15"),
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );
  console.log("Token                                         Balance");
  console.log("------------------------------------------------------------");
  tokenAccounts.value.forEach((tokenAccount) => {
    const accountData = AccountLayout.decode(tokenAccount.account.data);
    console.log(`${new PublicKey(accountData.mint)}   ${accountData.amount}`);
  });
}

/**
 * Transfers a specified amount of SPL tokens from one account to another.
 * @param {Connection} connection - The connection to the Solana blockchain.
 * @param {Keypair} fromWallet - The keypair of the wallet from which tokens will be transferred.
 * @param {PublicKey} toWallet - The public key of the wallet to which tokens will be transferred.
 * @param {PublicKey} mint - The public key of the mint associated with the tokens being transferred.
 * @returns {Promise<TransactionSignature>} - A promise that resolves to the transaction signature of the transfer.
 */
export async function transferSplToken(
  connection: Connection,
  fromWallet: Keypair,
  toWallet: PublicKey,
  mint: PublicKey
) {
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    fromWallet.publicKey
  );

  // Get the token account of the toWallet address, and if it does not exist, create it
  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    toWallet
  );

  // Mint 1 new token to the "fromTokenAccount" account we just created
  let signature = await mintTo(
    connection,
    fromWallet,
    mint,
    fromTokenAccount.address,
    fromWallet.publicKey,
    1000000000
  );
  console.log("mint tx:", signature);

  // Transfer the new token to the "toTokenAccount" we just created
  signature = await transfer(
    connection,
    fromWallet,
    fromTokenAccount.address,
    toTokenAccount.address,
    fromWallet.publicKey,
    50
  );
}
