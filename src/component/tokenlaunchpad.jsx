import React, { useState, useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";

export function Tokenlaunchpad() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [tokenMintAddress, setTokenMintAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState({
    name: "",
    symbol: "",
    image: "",
    amount: "",
  });
  const [signature, setSignature] = useState("");
  const [tokenProgramId, setTokenProgramId] = useState("");
  const [signers, setSigners] = useState([]);

  const handleFormFieldChange = (fieldName, e) => {
    setToken({ ...token, [fieldName]: e.target.value });
  };

  const createToken = async () => {
    if (!publicKey) {
      alert("Please connect your wallet first.");
      return;
    }

    setIsLoading(true);

    try {
      const mintKeypair = Keypair.generate();

      const createNewTokenTransaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: 82,
          lamports: 1000000000,
          programId: SystemProgram.programId,
        })
      );

      const txSignature = await sendTransaction(createNewTokenTransaction, connection, {
        signers: [mintKeypair],
      });

      setTokenMintAddress(mintKeypair.publicKey.toString());
      setSignature(txSignature);
      setTokenProgramId(SystemProgram.programId.toString());
      setSigners([publicKey.toString(), mintKeypair.publicKey.toString()]);

      alert(`Token creation successful. Signature: ${txSignature}`);
    } catch (error) {
      alert("Token creation failed, please try again.");
    }

    setIsLoading(false);
  };

  // Use useMemo to create a token summary
  const tokenSummary = useMemo(() => {
    return `Token Name: ${token.name}, Symbol: ${token.symbol}, Initial Supply: ${token.amount}`;
  }, [token.name, token.symbol, token.amount]); // Recalculate when these fields change

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h1 style={{
        margin: 0,
    fontSize: '40px', // Increase font size
    fontWeight: 'bold', // Make text bold
    color:'#f3f1ed', // Gold color
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Add a subtle shadow
      }}>Solana Token Launchpad </h1>
         <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '300px',  // Compact form
      margin: '0 auto',
      padding: '8px',
      borderRadius: '8px',
    }}>
      <style>
        {`
          textarea::placeholder {
            color: #333;    /* Darker placeholder text */
            opacity: 1;     /* Ensure it's fully visible */
            font-weight: bold;
          }
        `}
      </style>

      <textarea
        placeholder='Name'
        value={token.name}
        onChange={(e) => handleFormFieldChange('name', e)}
        style={{
          width: '100%',
          padding: '6px',
          border: '1px solid #ccc',
          borderRadius: '3px',
          marginBottom: '6px',
          fontSize: '12px',   
          resize: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.4)', 
          color: '#000',
        }}
      /><br />

      <textarea
        placeholder='Symbol'
        value={token.symbol}
        onChange={(e) => handleFormFieldChange('symbol', e)}
        style={{
          width: '100%',
          padding: '6px',
          border: '1px solid #ccc',
          borderRadius: '3px',
          marginBottom: '6px',
          fontSize: '12px',
          resize: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.4)', 
          color: '#000',
        }}
      /><br />

      <textarea
        placeholder='Initial Supply'
        value={token.amount}
        onChange={(e) => handleFormFieldChange('amount', e)}
        style={{
          width: '100%',
          padding: '6px',
          border: '1px solid #ccc',
          borderRadius: '3px',
          marginBottom: '6px',
          fontSize: '12px',   
          resize: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.4)', 
          color: '#000',
        }}
      /><br />

      <button
        onClick={createToken}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '8px',
          backgroundColor: isLoading ? '#999' : 'black',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '12px',   
          transition: 'background-color 0.3s ease',
        }}>
        {isLoading ? "Creating..." : "Create a token"}
      </button>
    </div>
      {signature && (
        <div>
          <h3>Transaction Details:</h3>
          <p><strong>Signature:</strong> {signature}</p>
          <p><strong>Token Program ID:</strong> {tokenProgramId}</p>
          <p><strong>Signers:</strong> {signers.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
