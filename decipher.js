"use srict";
const readline = require("readline-sync");
const crypto = require("crypto");

const algorithm = "aes-192-cbc";
let password = readline.question("Geben Sie das Passwort ein:");
let encrypted = readline.question("Geben Sie den zu entschlüssenden Text ein:");

// Zuerst wird der Schlüssel generiert, da er vom Algorithmus abhängig ist.
// In diesem Fall für aes192 beträgt der Schlüssel 24 Byte (192 Bit).
// Zur Entschlüsselung verwenden wir stattdessen das asynchrone `crypto.scrypt()`.
const key = crypto.scryptSync(password, "salt", 24);
// Der IV wird in der Regel zusammen mit dem Chiffretext übermittelt.
const iv = Buffer.alloc(16, 0); // Initialization vector.

// Dechiffrierung mit Schlüssel und iv erstellen
const decipher = crypto.createDecipheriv(algorithm, key, iv);

let decrypted = "";
decipher.on("readable", () => {
  while (null !== (chunk = decipher.read())) {
    decrypted += chunk.toString("utf8");
  }
});
decipher.on("end", () => {
  console.log(decrypted);
  // Prints: some clear text data
});

// Verschlüsselt mit demselben Algorithmus, Schlüssel und iv.
decipher.write(encrypted, "hex");
decipher.end();
