import { Keypair, PublicKey } from "@solana/web3.js";

export const RPC_ENDPOINT = "https://quiet-flashy-cherry.solana-devnet.discover.quiknode.pro/2f6b70a2c5f5be9a0e478c0857e4078d4cd9bde1/";

const keypair = Keypair.generate();

export const PROGRAM_ID = keypair.publicKey;


//console.log('Generated public key:', publicKey.toString());
