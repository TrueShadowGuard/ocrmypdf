import express from "express";
import {spawn} from "child_process";
import multer from "multer";
import {clearTmp} from "./clearTmp.js";
import path from "path";
import Ticket from "./Ticket.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const upload = multer({dest: path.join(__dirname, 'tmp') });

const ticketsRouter = express.Router();

export const tickets = {};

ticketsRouter.post("/", upload.single('pdf'), (req, res) => {
  const ticket = new Ticket(req.file);
  tickets[ticket.id] = ticket;
  res.json(ticket);

  const ocrmypdf = spawn("ocrmypdf", ["-l", "rus", ticket.inputPath, ticket.outputPath]);

  setTimeout(function () {
    clearTmp(filename => filename.startsWith(ticket.inputName));
  }, 1000 * 60 * 30);

  ocrmypdf.on("exit", async (code) => {
    if(code !== 0) {
      tickets.status = Ticket.statuses.ERROR;
      return;
    }

    ticket.status = Ticket.statuses.SUCCESS;
    ticket.downloadLink = ticket.outputName;
  });

  ocrmypdf.stdout.on("data", data => {
    console.log("DATA======= " + data.replace(/ /g, ""));
  })
});

ticketsRouter.get("/:id", (req, res) => {
  if(tickets[req.params.id]) return res.json(tickets[req.params.id])
  else res.status(404).json("Not found");
});

export default ticketsRouter;
