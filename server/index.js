import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws"; 
import questions from "./questions.js"; 

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = 3000;
let players = [];
let currentQuestion = "";  // Inisialisasi variabel
let currentAnswer = "";    // Inisialisasi variabel

// Pilih pertanyaan secara acak
function chooseQuestion() {
  const random = questions[Math.floor(Math.random() * questions.length)];
  currentQuestion = random.question;  
  currentAnswer = random.answer;
  console.log("Soal baru:", currentQuestion);
}

// Kirim pesan ke semua client
function broadcast(data, except = null) {
  players.forEach((player) => {
    if (player !== except && player.readyState === 1) { 
      player.send(JSON.stringify(data));
    }
  });
}

wss.on("connection", (ws) => {
  console.log("Pemain baru terhubung.");
  players.push(ws);

  // Pilih pertanyaan baru dan kirim ke semua pemain
  chooseQuestion();

  // Kirim pertanyaan kepada semua pemain yang terhubung
  ws.send(JSON.stringify({
    type: "question",
    question: currentQuestion
  }));

  // Handle pesan dari client
  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "guess") {
      const correct = data.guess.toLowerCase().trim() === currentAnswer.toLowerCase().trim();

      if (correct) {
        broadcast({
          type: "win",
          guess: data.guess,
          player: data.name
        });

        // Ambil pertanyaan baru & kirim ke semua
        chooseQuestion();
        broadcast({
          type: "question",
          question: currentQuestion
        });
      } else {
        broadcast({
          type: "guess",
          guess: data.guess,
          player: data.name
        });
      }
    }
  });

  ws.on("close", () => {
    console.log("Pemain terputus.");
    players = players.filter((p) => p !== ws);

    // Kirim pertanyaan baru ke semua pemain jika ada pemain yang tersisa
    if (players.length > 0) {
      chooseQuestion();
      broadcast({
        type: "question",
        question: currentQuestion
      });
    }
  });
});

// Jalankan server
server.listen(PORT, () => {
  console.log(`WebSocket server berjalan di http://localhost:${PORT}`);
});
