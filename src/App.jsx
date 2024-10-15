import React from 'react'; 
import { Tokenlaunchpad } from './component/tokenlaunchpad';
import './App.css';
import './index.css';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import ShowSolBalance from './component/balance';

function App() {
  return (
    <>
      <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <div style={{ position: 'relative', width: '100%' }}>
              <WalletMultiButton/>
            </div>
            <ShowSolBalance  />
           <Tokenlaunchpad style={{ marginTop: '-50px' }} />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>      
    </>
  );
}

export default App;
