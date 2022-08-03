"use srict";
const readline = require("readline-sync");
const crypto = require("crypto");

const algorithm = "aes-192-cbc";
let password = readline.question("Geben Sie das Passwort ein:");
let text = readline.question("Geben Sie den zu verschlüsselnden Text ein: ");

// Zunächst wird der Schlüssel generiert, da er vom Algorithmus abhängig ist.
// In diesem Fall für aes192 ist der Schlüssel 24 Bytes (192 Bits).
crypto.scrypt(password, "salt", 24, (err, key) => {
  if (err) throw err;
  // Danach erzeugen wir einen Zufallsvektor (Initialisierungsvektor)
  crypto.randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // Cipher mit Schlüssel und iv erstellen
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = "";
    cipher.setEncoding("hex");

    cipher.on("data", (chunk) => (encrypted += chunk));
    cipher.on("end", () =>
      console.log(text + "wird zu " + encrypted + " verschlüsselt")
    ); // gibt verschlüsselte Daten aus

    cipher.write(text);
    cipher.end();
  });
});
