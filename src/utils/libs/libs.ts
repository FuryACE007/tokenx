import { createMint } from "@solana/spl-token";
import { Connection, PublicKey, Signer } from "@solana/web3.js";

export async function createFungibleToken(
  connection: Connection,
  payer: Signer,
  mintAuthority: PublicKey,
  decimals: number
) {
  const mint = createMint(connection, payer, mintAuthority, null, decimals);

  return (await mint).toBase58();
}
