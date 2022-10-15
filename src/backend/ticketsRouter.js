import express from "express";
import {spawn} from "child_process";
import multer from "multer";
import {clearTmp} from "./clearTmp.js";

const upload = multer({dest: 'tmp/'})

const ticketsRouter = express.Router();

const tickets = {};

class Ticket {
  static statuses = {
    IN_PROGRESS: "IN PROGRESS",
    SUCCESS: "SUCCESS",
    ERROR: "ERROR"
  }
  constructor({originalFileName, inputFileName, outputFileName}) {
    this.status = Ticket.statuses.IN_PROGRESS;
    this.originalFileName = originalFileName;
    this.inputFileName = inputFileName;
    this.outputFileName = outputFileName;
    this.id = outputFileName;
  }
}

ticketsRouter.post("/", upload.single('pdf'), (req, res) => {
  const originalFileName = req.file.originalname;
  const inputFileName = req.file.filename;
  const outputFileName = inputFileName + ".ocr";

  tickets[outputFileName] = new Ticket({originalFileName, inputFileName, outputFileName})

  res.json(tickets[outputFileName]);

  const ocrmypdf = spawn("ocrmypdf", ["-l", "rus", req.file.path, req.file.path + ".ocr"]);

  setTimeout(function () {
    clearTmp(filename => filename.startsWith(inputFileName));
  }, 1000 * 60 * 30);

  ocrmypdf.on("exit", async (code) => {
    if(code !== 0) {
      tickets[outputFileName].status = Ticket.statuses.ERROR;
      return;
    }

    tickets[outputFileName].status = Ticket.statuses.SUCCESS;
    tickets[outputFileName].downloadLink = "/tmp/" + outputFileName;
  });


});

ticketsRouter.get("/:id", (req, res) => {
  if(tickets[req.params.id]) return res.json(tickets[req.params.id])
  else res.status(404).json("Not found");
});

export default ticketsRouter;