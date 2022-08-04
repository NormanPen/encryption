"use srict";
const readline = require("readline-sync");
const crypto = require("crypto");
const fs = require("fs");

const algorithm = "aes-192-cbc";
let password = readline.question("Geben Sie das Passwort ein:");
let text = readline.question("Geben Sie den zu verschlüsselnden Text ein: ");

const start = () => {
  let again = readline.question("Speichern? (y/n)");

  if (again == "y") {
    startCrypto();
  } else {
    process.exit(1);
  }
};

const startCrypto = () => {
  crypto.scrypt(password, "salt", 24, (err, key) => {
    if (err) throw err;

    crypto.randomFill(new Uint8Array(16), (err, iv) => {
      if (err) throw err;

      const cipher = crypto.createCipheriv(algorithm, key, iv);

      let encrypted = "";
      const file = fs.createWriteStream("tresor.txt");
      cipher.setEncoding("hex");

      cipher.on("data", (chunk) => (encrypted += chunk));
      cipher.on(
        "end",
        () => file.write(encrypted),
        console.log("Verschlüsselung in tresor.txt gespeicher")
      );

      cipher.write(text);

      cipher.end();
    });
  });
};

start();
