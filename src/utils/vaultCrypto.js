/**
 * VORA AI Knowledge Vault Master Crypto Engine (AES-256 암·복호화 보안 엔진)
 * 
 * 🛡️ Security Specifications:
 * 1. Proprietary IP protection against scraping and unauthorized dumping.
 * 2. Super Admin master export & import with full plain-text JSON decryption.
 * 3. Zero external dependency using Web Standard SubtleCrypto (AES-GCM 256-bit).
 */

const DEFAULT_MASTER_SALT = 'VORA_KOREA_TRAVEL_IP_2026_MASTER';

/**
 * 🔑 사용자 마스터 패스프레이즈로부터 256-bit AES-GCM 암호화 키 파생
 */
async function deriveKey(passphrase, salt = DEFAULT_MASTER_SALT) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * 🔒 원본 객체/배열/문자열을 AES-256-GCM 암호문(Base64)으로 암호화
 */
export async function encryptVaultData(data, secretKey = 'VORA_SUPER_ADMIN_MASTER_KEY') {
  try {
    const rawText = typeof data === 'string' ? data : JSON.stringify(data);
    const enc = new TextEncoder();
    const key = await deriveKey(secretKey);

    // 12-byte random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedContent = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(rawText)
    );

    // Combine IV + Encrypted Buffer
    const combined = new Uint8Array(iv.length + encryptedContent.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedContent), iv.length);

    // Convert to standard Base64 string
    let binary = '';
    const bytes = new Uint8Array(combined);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch (err) {
    console.error('[VaultCrypto] Encryption failed:', err);
    throw new Error(`지식 암호화 실패: ${err.message}`);
  }
}

/**
 * 🔓 암호화된 Base64 문자열을 원본 평문 JSON/객체로 복호화
 */
export async function decryptVaultData(encryptedBase64, secretKey = 'VORA_SUPER_ADMIN_MASTER_KEY') {
  try {
    const binary = atob(encryptedBase64.trim());
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    if (bytes.length < 13) {
      throw new Error('암호문 길이가 너무 짧습니다.');
    }

    const iv = bytes.slice(0, 12);
    const cipherData = bytes.slice(12);

    const key = await deriveKey(secretKey);
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      cipherData
    );

    const dec = new TextDecoder();
    const plainText = dec.decode(decryptedBuffer);

    // Try parsing as JSON if applicable
    try {
      return JSON.parse(plainText);
    } catch {
      return plainText;
    }
  } catch (err) {
    console.error('[VaultCrypto] Decryption failed:', err);
    throw new Error(`지식 복호화 실패 (비밀키 불일치 또는 데이터 손상): ${err.message}`);
  }
}
