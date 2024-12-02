// Solana Connection
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

    // Connect Wallet Button
    const connectButton = document.getElementById('connect-wallet');
    connectButton.addEventListener('click', async () => {
        const response = await window.solana.connect();
        walletAddress = response.publicKey.toString();
        alert(`Wallet connected: ${walletAddress}`);
    });

    // Buy Token Button
    const buyButton = document.getElementById('buy-token');
    buyButton.addEventListener('click', async () => {
        if (!walletAddress) {
            alert('Please connect your wallet first.');
            return;
        }

        const amount = document.getElementById('token-amount').value;
        if (!amount || amount < 0.01) {
            alert('Please enter a valid amount (min 0.01 SOL).');
            return;
        }

        const toPublicKey = new solanaWeb3.PublicKey(
            '4miKFSQZysmvRR6PnqQB8HzybCg1ZoF6QKaocbdtnXHs'
        );
        const fromPublicKey = new solanaWeb3.PublicKey(walletAddress);
        const transaction = new solanaWeb3.Transaction().add(
            solanaWeb3.SystemProgram.transfer({
                fromPubkey: fromPublicKey,
                toPubkey: toPublicKey,
                lamports: solanaWeb3.LAMPORTS_PER_SOL * amount,
            })
        );

        const { blockhash } = await connection.getRecentBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromPublicKey;

        try {
            const signedTransaction = await window.solana.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTransaction.serialize());
            alert(`Transaction sent! Signature: ${signature}`);
        } catch (err) {
            alert(`Transaction failed: ${err.message}`);
        }
    });
});
