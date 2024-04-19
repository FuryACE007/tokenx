import {
  createMint,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { Connection, PublicKey, Signer } from "@solana/web3.js";

export async function createFungibleToken(
  connection: Connection,
  payer: Signer,
  mintAuthority: PublicKey,
  decimals: number
) {
  const mint = createMint(connection, payer, mintAuthority, null, decimals);

  return await mint;
}

export async function mintTokens(
  connection: Connection,
  payer: Signer,
  mint: PublicKey
) {
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    new PublicKey(payer.publicKey)
  );

  console.log("Token Account: ", tokenAccount.address.toBase58());
  // 7UX2i7SucgLMQcfZ75s3VXmZZY4YRUyJN9X1RgfMoDUi
}
