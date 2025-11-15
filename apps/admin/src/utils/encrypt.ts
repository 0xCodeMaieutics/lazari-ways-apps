import crypto from "crypto";

const IV_LENGTH: number = 16; // For AES, this is always 16

export function keyGen() {
  return crypto.randomBytes(32).toString("hex");
}

export function encrypt(plainText: string, keyHex: string): string {
  const iv = crypto.randomBytes(IV_LENGTH); // Directly use Buffer returned by randomBytes
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(keyHex, "hex"),
    iv
  );
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);

  // Return iv and encrypted data as hex, combined in one line
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string, keyHex: string): string {
  const [ivHex, encryptedHex] = text.split(":");
  if (!ivHex || !encryptedHex) {
    throw new Error("Invalid or corrupted cipher format");
  }

  const encryptedText = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(keyHex, "hex"),
    Buffer.from(ivHex, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decrypted.toString();
}
