//This file allows us to use context to pull our components rather than app drilling

import { createContext, useCallback, useEffect, useState } from "react";
import { getProgram } from "../utils/program";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

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

    // get a connection and wallet
    const { connection } = useConnection()
    const  wallet  = useAnchorWallet()

    //set up useEffect to run on create, upload, or delete of a component 
    useEffect(()=> {

        //check if theres a connection and wallet. if not, set the wallet to empty. if there is, set the program to whatever it is
        if(connection){
            setProgram(getProgram(connection, wallet ?? {}))
        } else {
            setProgram(null)
        }

        //set our dependency module below to connection and wallet. useEffect will run when the page first loads, AND 
        //if get a connection and wallet OR if that changes at all
    }, [connection, wallet])

    return(
        <GlobalContext.Provider
            value = {{
                program
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}