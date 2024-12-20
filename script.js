// Verbindung zur Solana Blockchain mit Ankr RPC
const connection = new solanaWeb3.Connection(
    "https://rpc.ankr.com/solana", // Ankr Mainnet RPC-Endpunkt
    'confirmed'
);

// Verkäufer-Wallet-Adresse
const SELLER_WALLET = "4miKFSQZysmvRR6PnqQB8HzybCg1ZoF6QKaocbdtnXHs";

// Token Mint-Adresse (falls benötigt)
const TOKEN_MINT_ADDRESS = "5iG1EEbzz2z3PWUfzPMR5kzRcX1SuXzehsU7TL3YRrCB";

let walletAddress = null;

document.addEventListener('DOMContentLoaded', () => {
    if (!window.solana || !window.solana.isPhantom) {
        alert('Please install a Solana wallet like Phantom to use this dApp.');
        return;
    }

    // Wallet verbinden
    document.getElementById("connect-wallet").addEventListener("click", async () => {
        try {
            const response = await window.solana.connect({ onlyIfTrusted: false });
            walletAddress = response.publicKey.toString();
            console.log(`Wallet connected: ${walletAddress}`);
            alert(`Wallet connected: ${walletAddress}`);
        } catch (err) {
            console.error("Failed to connect wallet:", err);
            alert("Wallet connection failed. Please try again.");
        }
    });

    // Token kaufen
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

            const { blockhash } = await connection.getRecentBlockhash('finalized');
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
