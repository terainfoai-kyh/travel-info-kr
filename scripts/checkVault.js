const fs = require('fs');

function decryptData(cipherText, secretKey = 'vora_secure_vault_2026') {
  if (!cipherText || typeof cipherText !== 'string') return null;
  try {
    const SALT_VECTORS = [0x5A, 0xA5, 0x3C, 0xC3, 0x69, 0x96, 0x7E, 0xE7];
    const binary = Buffer.from(cipherText, 'base64').toString('binary');
    const cipherBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      cipherBytes[i] = binary.charCodeAt(i);
    }
    const keyBytes = Buffer.from(secretKey, 'utf8');
    const plainBytes = new Uint8Array(cipherBytes.length);
    for (let i = 0; i < cipherBytes.length; i++) {
      const k = keyBytes[i % keyBytes.length];
      const s = SALT_VECTORS[i % SALT_VECTORS.length];
      plainBytes[i] = cipherBytes[i] ^ k ^ s;
    }
    const jsonStr = Buffer.from(plainBytes).toString('utf8');
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('Decryption failed:', e);
    return null;
  }
}

const vaultFile = fs.readFileSync('src/data/voraQnaVault.js', 'utf8');
const match = vaultFile.match(/VORA_ENCRYPTED_VAULT_PAYLOAD = "([^"]+)"/);
if (match) {
  const list = decryptData(match[1]);
  console.log('Decrypted item count:', list.length);
  list.forEach((item, idx) => {
    const rep = item.reply || '';
    if (rep.includes('트립백') || rep.includes('ZimCarry') || rep.includes('짐') || rep.includes('물품보관')) {
      console.log(`[Item ${idx}] Title: ${item.title}`);
      console.log(`Patterns: ${JSON.stringify(item.patterns)}`);
      console.log(`Reply: ${item.reply}`);
      console.log('---');
    }
  });
}
