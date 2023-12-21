const {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  PublicKey,
} = require("@solana/web3.js");

const bs58 = require("bs58");

// Replace these values with your own
const senderPrivateKey =
  "2tLJpu1SxAbYUJvzEN1zobT9BQAbgdUMhXL5bFnSaB3dtnr7jYfVxHovmiKTFKwQUqypiPYvyWB3Lpn7TbgKGY1U";
const recipientAddress = ["EbawwJmyB3va66cijPvhU4k1TNCDU8pQNBPzsbzuBE2o"];

async function sendSolana() {
  const connection = new Connection(
    "https://devnet.helius-rpc.com/?api-key=692a250e-b875-4394-8e62-78b6e251a78f"
  );

  const senderWallet = Keypair.fromSecretKey(
    new Uint8Array(bs58.decode(senderPrivateKey))
  );

  for (let i = 0; i < recipientAddress.length; i++) {
    let senderAddress = recipientAddress[i];
    senderAddress = new PublicKey(senderAddress);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderAddress,
        toPubkey: new PublicKey(recipientAddress),
        lamports: 1 * LAMPORTS_PER_SOL,
      })
    );

    transaction.feePayer = senderWallet.publicKey;

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      senderWallet,
      senderAddress,
    ]);
  }
}

sendSolana().catch((error) => console.error(error));
