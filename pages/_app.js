import '../styles/globals.css'
import { useEffect, useMemo, useState } from "react";
import { RPC_ENDPOINT } from "../utils";
import { GlobalState } from '../state/global';

//Wallet Imports
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter
} from "@solana/wallet-adapter-wallets"

//Import button Styling from Solana
import "@solana/wallet-adapter-react-ui/styles.css"
 

function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter()
    ], []
  );

  // In order to fix SSR error with Next
  useEffect(() => {
    setMounted(true);
  }, []);

  return (

    // establish the connection to the blockchain network using the RPC_ENDPOINT.
    // commitment level set to confirmed so the application will consider a transaction confirmed once it 
    //is included in a block and a certain number of confirmations have been received
    <ConnectionProvider
      endpoint ={RPC_ENDPOINT}
      config = {{commitment: "confirmed"}}
    >
      // WalletProvider manages the wallet connections fort the app.
      // autoConnect allows the app to connect to a wallet if it already exists and is logged in
      <WalletProvider wallets={wallets} autoConnect>
        
        // WalletModalProvider provides a modal(popup) for users to interact with their wallets
        // The added condition then renders the amin component and passes down any page-specific properties (...pageProps)
        // The application will only rendered once the modal variable is true to ensure the app is fully initialized before rendering the main component
        <WalletModalProvider>
          {
            mounted && (
              <GlobalState>
                <Component {...pageProps} />
              </GlobalState>
            )
          }
        </WalletModalProvider>
      </WalletProvider >

    </ConnectionProvider>
  )
}

export default MyApp
