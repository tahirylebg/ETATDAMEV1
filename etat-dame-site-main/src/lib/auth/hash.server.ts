import { pbkdf2Async } from "@noble/hashes/pbkdf2.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { randomBytes } from "@noble/hashes/utils.js";

const ITERATIONS = 100_000;
const KEY_LEN = 32;

//Librairie de fonctions pour le hachage et la vérification des secrets (mots de passe) en utilisant PBKDF2 avec SHA-256.
function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Convertit une chaîne hexadécimale en un tableau d'octets (Uint8Array).
function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

// Hache un secret (mot de passe) en utilisant PBKDF2 avec SHA-256 et retourne une chaîne contenant le nombre d'itérations, le sel et le hachage.
export async function hashSecret(secret: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await pbkdf2Async(sha256, secret, salt, { c: ITERATIONS, dkLen: KEY_LEN });
  return `${ITERATIONS}:${toHex(salt)}:${toHex(hash)}`;
}

// Vérifie si un secret (mot de passe) correspond à un hachage stocké en utilisant PBKDF2 avec SHA-256. Retourne true si le secret correspond, sinon false.
export async function verifySecret(secret: string, stored: string): Promise<boolean> {
  const [iterationsStr, saltHex, hashHex] = stored.split(":");
  const iterations = Number(iterationsStr);
  if (!iterations || !saltHex || !hashHex) return false;
  const salt = fromHex(saltHex);
  const expected = fromHex(hashHex);
  const computed = await pbkdf2Async(sha256, secret, salt, {
    c: iterations,
    dkLen: expected.length,
  });
  if (computed.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < computed.length; i++) diff |= computed[i] ^ expected[i];
  return diff === 0;
}
