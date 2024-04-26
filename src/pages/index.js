import React from 'react';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="container mx-auto text-center">
      <h1 className="text-6xl font-bold my-8">Welcome to TokenX</h1>
      <p className="text-xl mb-8">Your one-stop platform for creating, minting, and transferring Solana tokens.</p>
      <Link href="/token-operations">
        <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Try Now
        </a>
      </Link>
    </div>
  );
};

export default LandingPage;
