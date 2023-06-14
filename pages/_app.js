import '../styles/globals.css'
import { useEffect, useMemo, useState } from "react";
import { RPC_ENDPOINT } from "../utils";

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

  // In order to fix SSR error with Next
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Component {...pageProps} />
  )
}

export default MyApp
