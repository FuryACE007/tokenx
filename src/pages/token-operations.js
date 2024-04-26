import React from 'react';

const TokenOperations = () => {
  return (
    <div className="container mx-auto text-center">
      <h1 className="text-4xl font-bold my-8">Token Operations</h1>
      <div className="my-4">
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2">
          Create Token
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">
          Mint Token
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-2">
          Send Token
        </button>
      </div>
    </div>
  );
};

export default TokenOperations;
