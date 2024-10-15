

import React, { useState, useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";


export function Tokenlaunchpad() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [ setTokenMintAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState({
    name: "",
    symbol: "",
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

  const tokenSummary = useMemo(() => {
    return `Token Name: ${token.name}, Symbol: ${token.symbol}, Initial Supply: ${token.amount}`;
  }, [token.name, token.symbol, token.amount]);

  return (
    <div className="token-launchpad-container">
      <h1>Solana Token Launchpad</h1>
      <div className="token-form">
        <textarea
          className="textarea-input"
          placeholder="Name"
          value={token.name}
          onChange={(e) => handleFormFieldChange("name", e)}
        /><br />

        <textarea
          className="textarea-input"
          placeholder="Symbol"
          value={token.symbol}
          onChange={(e) => handleFormFieldChange("symbol", e)}
        /><br />

        <textarea
          className="textarea-input"
          placeholder="Initial Supply"
          value={token.amount}
          onChange={(e) => handleFormFieldChange("amount", e)}
        /><br />

        <button
          className="token-button"
          onClick={createToken}
          disabled={isLoading}
        >
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
