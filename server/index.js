import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws"; 
import words from "./words.js";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });  

const OPEN = 1; 


const PORT = 3000;

let players = [];
let currentWord = "";
let host = null;

function broadcast(data, except = null) {
  const msg = JSON.stringify(data);
  players.forEach((player) => {
    if (player !== except && player.readyState === OPEN) {
      player.send(msg);
    }
  });
}

function chooseWord() {
  if (!Array.isArray(words) || words.length === 0) {
    console.error("Words list is empty or invalid.");
    currentWord = "";
    return;
  }
  const randomIndex = Math.floor(Math.random() * words.length);
  currentWord = words[randomIndex];
  console.log("Selected word:", currentWord);
}

wss.on("connection", (ws) => {
  console.log("A player connected.");
  players.push(ws);

  // Assign host if none exists
  if (!host) {
    host = ws;
    chooseWord();
    ws.send(JSON.stringify({ type: "host", word: currentWord }));
  } else {
    ws.send(JSON.stringify({ type: "player" }));
  }

  ws.on("message", (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      console.error("Invalid message format:", message);
      return;
    }

    if (data.type === "guess") {
      const guess = (data.guess || "").toLowerCase();
      const correct = guess === currentWord.toLowerCase();

      if (correct) {
        broadcast({ type: "win", guess: data.guess, player: data.name });
        chooseWord();

        if (host && host.readyState === OPEN) {
          host.send(JSON.stringify({ type: "host", word: currentWord }));
        }
      } else {
        broadcast({ type: "guess", guess: data.guess, player: data.name }, ws);
      }
    }
  });

  ws.on("close", () => {
    console.log("A player disconnected.");
    players = players.filter((p) => p !== ws);

    if (ws === host) {
      host = players[0] || null;
      if (host && host.readyState === OPEN) {
        chooseWord();
        host.send(JSON.stringify({ type: "host", word: currentWord }));
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
