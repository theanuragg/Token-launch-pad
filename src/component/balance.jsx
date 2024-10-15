import React, { useEffect, useState } from 'react'; 
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function ShowSolBalance() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [balance, setBalance] = useState(0); 

    const getBalance = async () => {
        if (wallet.publicKey) {
            const balance = await connection.getBalance(wallet.publicKey);
            setBalance(balance / LAMPORTS_PER_SOL); 
        }
    };

    useEffect(() => {
        getBalance();
    }, [wallet.publicKey, connection]); 

    return (
      <div style={{ position: 'relative', textAlign: 'center', top: '20px' }}>
  <p style={{
    margin: 0,
    fontSize: '20px', 
    fontWeight: 'bold',
    color:'#4164f0',
      }}>
    SOL Balance:
  </p>
  <div style={{
    margin: 0,
    fontSize: '32px', 
    fontWeight: '600', 
    colour:'##100f17',
    fontFamily: 'Arial, sans-serif',
  }}>
    {balance} SOL
  </div>
</div>

    );
}

export default ShowSolBalance;

