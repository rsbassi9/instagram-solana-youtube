import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

import { PROGRAM_ID } from "./constants";

// This function lets us see into our Solana program and access the fucntions
export const getProgram = async (connection, wallet) => {
  const IDL = require("./idl.json");
  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );
  await provider.ready;
  const program = new Program(IDL, PROGRAM_ID, provider);
  return program;
};

//A function to get the users publickey from Solana using the seeds we determined in SeaHorse
export const getUserAccountPk = async (owner) => {
  return (
    await PublicKey.findProgramAddressSync(
      [Buffer.from("user"), owner.toBuffer()],
      PROGRAM_ID
    )
  )[0];
};

export const getPostAccountPk = async (owner, id) => {
  return (
    await PublicKey.findProgramAddressSync(
      [
        Buffer.from("post"),
        owner.toBuffer(),

        // change our input type to something Solana can read
        new BN(id).toArrayLike(Buffer, "le", 8),
      ],
      PROGRAM_ID
    )
  )[0];
};

export const getLikeAccountPk = async (owner, id, liker) => {
  return (
    await PublicKey.findProgramAddressSync(
      [
        // change format of a string to something Solana can read from our seed
        Buffer.from("like"),
        
        // change format of a Public Key to something Solana can read from our seed
        owner.toBuffer(),
        
        // change format of a u64 to something Solana can read from our seed
        new BN(id).toArrayLike(Buffer, "le", 8),
        
        liker.toBuffer(),
      ],
      PROGRAM_ID
    )
  )[0];
};
