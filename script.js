// Verbindet mit dem Solana Devnet
const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl('devnet'),
    'confirmed'
);

let walletAddress = null;

document.addEventListener('DOMContentLoaded', () => {
    if (!window.solana) {
        alert('Please install a Solana wallet like Phantom.');
        return;
    }

    // Wallet verbinden
    const connectButton = document.getElementById("connect-wallet");
    connectButton.addEventListener("click", async () => {
        try {
            const response = await window.solana.connect({ onlyIfTrusted: false });
            walletAddress = response.publicKey.toString();
            alert(`Wallet connected: ${walletAddress}`);
            console.log(`Wallet connected: ${walletAddress}`);
        } catch (err) {
            console.error("Failed to connect wallet:", err);
            alert("Wallet connection failed. Please try again.");
        }
    });

    // Token kaufen
    const buyButton = document.getElementById("buy-token");
    buyButton.addEventListener("click", async () => {
        if (!walletAddress) {
            alert("Please connect your wallet first!");
            console.error("No wallet connected.");
            return;
        }

        const amount = document.getElementById("token-amount").value;
        if (!amount || parseFloat(amount) < 0.01) {
            alert("Enter a valid amount of at least 0.01 SOL.");
            console.error("Invalid amount entered:", amount);
            return;
        }

        try {
            const fromPublicKey = new solanaWeb3.PublicKey(walletAddress);
            const toPublicKey = new solanaWeb3.PublicKey("4miKFSQZysmvRR6PnqQB8HzybCg1ZoF6QKaocbdtnXHs");
            const lamports = Math.floor(parseFloat(amount) * solanaWeb3.LAMPORTS_PER_SOL);

            console.log("From Wallet:", fromPublicKey.toBase58());
            console.log("To Wallet:", toPublicKey.toBase58());
            console.log("Lamports:", lamports);

            const latestBlockhash = await connection.getLatestBlockhash();
            console.log("Latest Blockhash:", latestBlockhash);

            const transaction = new solanaWeb3.Transaction({
                feePayer: fromPublicKey,
                recentBlockhash: latestBlockhash.blockhash,
            });

            const transferInstruction = solanaWeb3.SystemProgram.transfer({
                fromPubkey: fromPublicKey,
                toPubkey: toPublicKey,
                lamports: lamports,
            });

            transaction.add(transferInstruction);

            const signedTransaction = await window.solana.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
                skipPreflight: false,
            });

            alert(`Transaction successful! Signature: ${signature}`);
            console.log("Transaction sent successfully:", signature);
        } catch (err) {
            alert(`Transaction failed: ${err.message}`);
            console.error("Transaction failed:", err);
        }
    });
});

