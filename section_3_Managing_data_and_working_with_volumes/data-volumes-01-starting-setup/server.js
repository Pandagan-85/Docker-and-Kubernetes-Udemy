const fs = require("fs").promises;
const exists = require("fs").exists;
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));
app.use("/feedback", express.static("feedback"));

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "pages", "feedback.html");
  res.sendFile(filePath);
});

app.get("/exists", (req, res) => {
  const filePath = path.join(__dirname, "pages", "exists.html");
  res.sendFile(filePath);
});

app.post("/create", async (req, res) => {
  try {
    const title = req.body.title;
    const content = req.body.text;

    if (!title || !content) {
      return res.status(400).send("Title e content sono obbligatori");
    }

    // Sanifica il titolo: rimuovi spazi e caratteri speciali
    const adjTitle = title
      .toLowerCase()
      .trim() // Rimuovi spazi all'inizio e fine
      .replace(/\s+/g, "-") // Sostituisci spazi con trattini
      .replace(/[^a-z0-9-]/g, "") // Mantieni solo lettere, numeri e trattini
      .replace(/-+/g, "-") // Rimuovi trattini multipli
      .replace(/^-|-$/g, ""); // Rimuovi trattini all'inizio/fine

    console.log("Original title:", title);
    console.log("Sanitized title:", adjTitle);

    const tempFilePath = path.join(__dirname, "temp", adjTitle + ".txt");
    const finalFilePath = path.join(__dirname, "feedback", adjTitle + ".txt");

    console.log("Temp file path:", tempFilePath);
    console.log("Final file path:", finalFilePath);

    // Scrivi nel file temporaneo
    await fs.writeFile(tempFilePath, content);

    // Verifica se il file finale già esiste
    try {
      await fs.access(finalFilePath);
      await fs.unlink(tempFilePath);
      res.redirect("/exists");
    } catch (error) {
      await fs.copyFile(tempFilePath, finalFilePath);
      await fs.unlink(tempFilePath);
      res.redirect("/");
    }
  } catch (error) {
    console.error("Errore:", error);
    res.status(500).send("Errore interno del server");
  }
});

// app.listen(80);
// This will use the PORT environment variable set in the Dockerfile
app.listen(process.env.PORT);
