//This file allows us to use context to pull our components rather than app drilling

import { createContext, useCallback, useEffect, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

import { 
    getProgram,
    getPostAccountPk,
    getLikeAccountPk,
    getUserAccountPk, 
} from "../utils";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import toast from "react-hot-toast"

export const GlobalContext = createContext({
    isConnected: null,
    wallet: null,
    hasUserAccount: null,
    posts: null,
    fetchPosts: null,
    createUser: null,
    createPost: null,
    updatePost: null,
    deletePost: null,
    likePost: null,
    dislikePost: null,
});

// set the state to program, so that it can be used anywhere once state is updated
export const GlobalState = ({children}) => {
    const [program, setProgram] = useState()
    const [isConnected, setIsConnected] = useState()
    const [userAccount, setUserAccount] = useState()

    // get a connection and wallet
    const { connection } = useConnection()
    const  wallet  = useAnchorWallet()

    //set up useEffect to run on create, upload, or delete of a component 
    useEffect(()=> {
      const fetchProgram = async () => {
        //check if theres a connection and wallet. if not, set the wallet to empty. if there is, set the program to whatever it is
        if(connection){
            setProgram(getProgram(connection, wallet ?? {}));
        } else {
            setProgram(null);
        }
      };

      fetchProgram();
        //set our dependency module below to connection and wallet. useEffect will run when the page first loads, AND 
        //if get a connection and wallet OR if that changes at all
    }, [connection, wallet]);

    // Check for a wallet connection
    useEffect(() => {
        setIsConnected(!!wallet?.publicKey); // will lead to true if there is a connecte wallet. flase otherwise
    }, [wallet]);

    const fetchUserAccount = useCallback(async () => {
        if (!program || !wallet || !connection) return;
      
        try {
          await connection.getAccountInfo(program.programId);
      
          const userAccountPk = await getUserAccountPk(wallet?.publicKey);
          if (!userAccountPk) {
            throw new Error("User account not found");
          }
          console.log(userAccountPk);
      
          const userAccount = await program.account.user.fetch(userAccountPk);
          console.log("User found!");
          setUserAccount(userAccount);
        } catch (e) {
          setUserAccount(null);
          console.log("No user found!");
        }
      }, [program, wallet, connection]);
      

    // Check for a user account by fetching a user
    /*const fetchUserAccount = useCallback( async () => {
        
        //if theres no program, return nothing
        if(!program || !wallet || !connection) return;

        //console.log("Program:", program);
        //console.log("Wallet:", wallet);
        //console.log("IsConnected:", isConnected);

        // if there is a program, make sure the wallet has loaded (?) and then fetch its public key:
        try {
            await connection.getAccountInfo(program.programId);

            console.log("Program:", program);
            console.log("Wallet:", wallet);
            console.log("IsConnected:", isConnected);

            const userAccountPk = await getUserAccountPk(wallet?.publicKey)
            console.log(userAccountPk)
            const userAccount = await program.account.user.fetch(userAccountPk);
            console.log("user found!")
            setUserAccount(userAccount)

        //otherwise, if there is a program and no user is found
        } catch (e) {
            setUserAccount(null);
            console.log("Error fetching user account:", e);
        }
    }, [program,wallet,connection]);*/

    // Check for user account
    useEffect (() => {
        fetchUserAccount();
    }, [program, wallet, isConnected]);

    // Create user
    const createUser = useCallback(async () => {
        if(!program) return; 

        try{
            const txHash = await program.methods
                .createUser()
                .accounts({
                    user: await getUserAccountPk(wallet.publicKey),
                    owner: wallet.publicKey,
                })
                .rpc()
            await connection.confirmTransaction(txHash)
            toast.success("Created user!")
            await fetchUserAccount();
        } catch (e){
            console.log("Couldn't create user", e.message)
            toast.error("Creating user failed!")
        }
    
    })

    return(
        <GlobalContext.Provider
            value = {{
                isConnected,
                hasUserAccount: userAccount ? true : false,
                createUser,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}