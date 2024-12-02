document.getElementById("buy-token").addEventListener("click", async () => {
    if (!walletAddress) {
        alert("Please connect your wallet first!");
        return;
    }

    const amount = document.getElementById("token-amount").value;
    if (!amount || parseFloat(amount) < 0.01) {
        alert("Enter a valid amount of at least 0.01 SOL.");
        return;
    }

    try {
        const fromPublicKey = new solanaWeb3.PublicKey(walletAddress);
        const toPublicKey = new solanaWeb3.PublicKey(SELLER_WALLET);
        const lamports = Math.floor(parseFloat(amount) * solanaWeb3.LAMPORTS_PER_SOL);

        console.log(`Preparing transaction of ${lamports} lamports...`);

        // Neuesten Blockhash abrufen
        const { blockhash } = await connection.getRecentBlockhash('finalized'); // Alternative Methode
        console.log("Blockhash:", blockhash);

        const transaction = new solanaWeb3.Transaction({
            feePayer: fromPublicKey,
            recentBlockhash: blockhash,
        });

        const transferInstruction = solanaWeb3.SystemProgram.transfer({
            fromPubkey: fromPublicKey,
            toPubkey: toPublicKey,
            lamports: lamports,
        });

        transaction.add(transferInstruction);

        const signedTransaction = await window.solana.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());
        console.log(`Transaction successful! Signature: ${signature}`);
        alert(`SOL Transaction successful! Signature: ${signature}`);
    } catch (err) {
        console.error("Transaction failed:", err);
        alert(`Transaction failed: ${err.message}`);
    }
});

    });
});


