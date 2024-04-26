import React, { useState } from 'react';
import CreateTokenForm from '../components/CreateTokenForm';

const TokenOperations = () => {
  const [activeForm, setActiveForm] = useState('');

  const handleButtonClick = (formName) => {
    setActiveForm(formName);
  };

  return (
    <div className="container mx-auto text-center">
      <h1 className="text-4xl font-bold my-8">Token Operations</h1>
      <div className="my-4">
        <button
          onClick={() => handleButtonClick('create')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2"
        >
          Create Token
        </button>
        <button
          onClick={() => handleButtonClick('mint')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
        >
          Mint Token
        </button>
        <button
          onClick={() => handleButtonClick('send')}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-2"
        >
          Send Token
        </button>
      </div>
      {activeForm === 'create' && <CreateTokenForm />}
      {/* Placeholder for MintTokenForm and SendTokenForm */}
      {activeForm === 'mint' && <div>Mint Token Form will go here</div>}
      {activeForm === 'send' && <div>Send Token Form will go here</div>}
    </div>
  );
};

export default TokenOperations;
