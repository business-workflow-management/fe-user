import CryptoJS from 'crypto-js';

/**
 * Encrypts a string using AES. The key is derived from the provided secret.
 * @param {string} text - The text to encrypt.
 * @param {string} secret - The secret key to use for encryption.
 * @returns {string|null} The encrypted string, or null if input is invalid.
 */
export const encrypt = (text, secret) => {
  if (text === null || typeof text === 'undefined' || !secret) {
    return null;
  }
  return CryptoJS.AES.encrypt(text, secret).toString();
};

/**
 * Decrypts an AES-encrypted string.
 * @param {string} ciphertext - The encrypted text.
 * @param {string} secret - The secret key used for encryption.
 * @returns {string|null} The decrypted text, or null if decryption fails.
 */
export const decrypt = (ciphertext, secret) => {
  if (ciphertext === null || typeof ciphertext === 'undefined' || !secret) {
    return null;
  }
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    // If the decrypted string is empty, it means the key was wrong.
    if (!originalText) {
        throw new Error("Decryption failed: Invalid key or corrupted data.");
    }
    return originalText;
  } catch (error) {
    console.error("Decryption error:", error.message);
    return null;
  }
};

// Simple encryption/decryption using user ID as key
// Note: This is a basic implementation. In production, consider using more robust encryption

const encryptData = (data, userId) => {
  if (!data || !userId) return data;
  
  try {
    // Create a simple key from userId
    const key = userId.toString().padEnd(16, '0').slice(0, 16);
    
    // Simple XOR encryption (for demonstration - in production use proper encryption)
    const encrypted = btoa(JSON.stringify(data))
      .split('')
      .map((char, index) => {
        const keyChar = key[index % key.length];
        return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
      })
      .join('');
    
    return btoa(encrypted);
  } catch (error) {
    console.error('Encryption failed:', error);
    return data;
  }
};

const decryptData = (encryptedData, userId) => {
  if (!encryptedData || !userId) return encryptedData;
  
  try {
    // Create the same key from userId
    const key = userId.toString().padEnd(16, '0').slice(0, 16);
    
    // Decrypt the data
    const encrypted = atob(encryptedData);
    const decrypted = encrypted
      .split('')
      .map((char, index) => {
        const keyChar = key[index % key.length];
        return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
      })
      .join('');
    
    return JSON.parse(atob(decrypted));
  } catch (error) {
    console.error('Decryption failed:', error);
    return encryptedData;
  }
};

export { encryptData, decryptData }; 