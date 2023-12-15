import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Inc } from "../target/types/inc";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";

describe("inc", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Inc as Program<Inc>;
  const user = anchor.AnchorProvider.local().wallet;
  // const user = Keypair.generate();
  const myAccount = Keypair.generate();

  console.log(myAccount.publicKey.toBase58());
  console.log(user.publicKey.toBase58());

  async function requestAirdrop(key: PublicKey) {
    const keyBalance = await program.provider.connection.getBalance(key);

    if (keyBalance < 2e9) {
      const airdropSignature = await program.provider.connection.requestAirdrop(
        key,
        2e9
      );

      const latestBlockHash =
        await program.provider.connection.getLatestBlockhash();

      await program.provider.connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airdropSignature,
      });
    }
  }

  it("Is initialized!", async () => {
    // await requestAirdrop(user.publicKey);

    const tx = await program.methods
      .initialize()
      .accounts({
        myAccount: myAccount.publicKey,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([myAccount])
      .rpc();
    console.log("Your transaction signature", tx);
  });

  // increament the account

  it("Increments the counter", async () => {
    if (!myAccount) {
      throw new Error("Account not initialized");
    }
    const txn = await program.methods
      .increment()
      .accounts({
        myAccount: myAccount.publicKey,
      })
      .rpc();
    const account = await program.account.myAccount.fetch(myAccount.publicKey);
    console.log("Your transaction signature", txn);
  });

  // decrement the account
    it("DEcrements the counter", async () => {
      if (!myAccount) {
        throw new Error("Account not initialized");
      }
      const txn = await program.methods
        .decrement()
        .accounts({
          myAccount: myAccount.publicKey,
        })
        .rpc();
      const account = await program.account.myAccount.fetch(
        myAccount.publicKey
      );
      console.log("Your transaction signature", txn);
    });
});
