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
    fontSize: '20px', // Increase font size
    fontWeight: 'bold', // Make text bold
    color: '#FFD700', // Gold color
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Add a subtle shadow
  }}>
    SOL Balance:
  </p>
  <div style={{
    margin: 0,
    fontSize: '32px', // Larger font size for balance
    fontWeight: '600', // Semi-bold
    color: '#FFFFFF', // White color
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Consistent shadow
    fontFamily: 'Arial, sans-serif', // Stylish font
  }}>
    {balance} SOL
  </div>
</div>

    );
}

export default ShowSolBalance;
