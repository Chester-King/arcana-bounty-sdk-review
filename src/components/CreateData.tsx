import {
  useConnection,
  useWallet,
  useAnchorWallet,
} from "@solana/wallet-adapter-react";
import { useAuth } from "@arcana/auth-react";
import {
  Keypair,
  SystemProgram,
  PublicKey,
  TransactionMessage,
  TransactionSignature,
  VersionedTransaction,
  Transaction,
} from "@solana/web3.js";
import { FC, useCallback } from "react";
import { notify } from "../utils/notifications";

import idl from "idl.json";
import {
  Program,
  Idl,
  AnchorProvider,
  setProvider,
  web3,
  BN,
} from "@project-serum/anchor";

interface Wallet {
  signTransaction(tx: Transaction): Promise<Transaction>;
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
  publicKey: PublicKey;
}

export const CreateData: FC = () => {
  const { connection } = useConnection();
  const {  sendTransaction } = useWallet();
  const { user  } = useAuth();
  let publicKey = user?.publicKey;

  const wallet = useAnchorWallet();
  const provider = new AnchorProvider(connection, wallet, {});
  setProvider(provider);

  const programID = new PublicKey(
    "7DK1RHivaNsQrQa5abpqMSN8nq3aavUgngLt35s4MNZf"
  );
  const program = new Program(idl as Idl, programID);

  const int = document.getElementById("int") as HTMLInputElement;

  const onClick = useCallback(async () => {
    if (!publicKey) {
      notify({ type: "error", message: `Wallet not connected!` });
      console.log("error", `Send Transaction: Wallet not connected!`);
      return;
    }

    let signature: TransactionSignature = "";
    try {
      let data_account = new PublicKey(
        "9cPBPMT7mLLrxKsKVmLMCNu5XHABdVdZuuEdyMZ3vTuv"
      );

      // let [data_account, vPDA1] =
      // web3.PublicKey.findProgramAddressSync(
      //   [Buffer.from("data"),, wallet.publicKey.toBuffer()],
      //   program.programId
      // );

      let int_value = 0;
      int_value = Number(int.value);

      const tx = await program.methods
        .createdata(new BN(int_value))
        .accounts({
          authority: wallet.publicKey,
          dataAccount: data_account,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      notify({
        type: "success",
        message: "Transaction successful!",
        txid: tx,
      });
    } catch (error: any) {
      notify({
        type: "error",
        message: `Transaction failed!`,
        description: error?.message,
        txid: signature,
      });
      console.log("error", `Transaction failed! ${error?.message}`, signature);
      return;
    }
  }, [publicKey, notify, connection, sendTransaction]);

  return (
    <div className="flex flex-row justify-center">
      <div className="relative group items-center">
        <div
          className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                  rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
        ></div>
        <button
          className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
          onClick={onClick}
          disabled={!publicKey}
        >
          <div className="hidden group-disabled:block ">
            Wallet not connected
          </div>
          <span className="block group-disabled:hidden">Create data</span>
        </button>
      </div>
      <span>
        <input type="text" id="int" className="text-black"></input>
      </span>
    </div>
  );
};
