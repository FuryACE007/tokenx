"use client";
import React, { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function TokenCreationForm() {
  const tokenName = useRef<HTMLInputElement>(null);
  const tokenSymbol = useRef<HTMLInputElement>(null);
  const tokenDescription = useRef<HTMLInputElement>(null);

  const [tokenNameValue, setTokenNameValue] = useState("");
  const [tokenSymbolValue, setTokenSymbolValue] = useState("");
  const [tokenDescriptionValue, setTokenDescriptionValue] = useState("");
  const [balance, setBalance] = useState(0);

  const { connection } = useConnection();
  const wallet = useWallet();

  if (connection && wallet.publicKey) {
    connection.getAccountInfo(wallet.publicKey).then((info) => {
      if (info?.lamports != null) {
        setBalance(info?.lamports / LAMPORTS_PER_SOL);
      } else console.log("No money :(");
    });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!connection || !wallet.publicKey) {
      return;
    }
    console.log("Pubkey", wallet.publicKey);

    // Checking the connected wallet's SOL balance
    await connection.getAccountInfo(wallet.publicKey).then((info) => {
      if (info?.lamports != null) {
        setBalance(info?.lamports / LAMPORTS_PER_SOL);
      } else {
        alert("0 balance");
      }
    });
  };
  return (
    <div className="max-w-md w-full mx-auto my-28 rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to Token
        <span className=" text-red-500 font-extrabold text-xl">X</span>
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Launch you token on Solana blockchain in minutes!
      </p>
      <WalletMultiButton />
      {balance && <div className=" my-3 text-white">Wallet Balance: {balance}</div>}
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">Token name</Label>
            <Input
              id="firstname"
              placeholder="Test Token"
              type="text"
              ref={tokenName}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Token Symbol</Label>
            <Input
              id="lastname"
              placeholder="TT"
              type="text"
              ref={tokenSymbol}
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Token Description</Label>
          <Input
            id="email"
            placeholder="Token Metadata"
            type="text"
            ref={tokenDescription}
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
