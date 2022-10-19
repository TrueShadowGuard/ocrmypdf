import express from "express";
import path from "path";
import ticketsRouter, {tickets} from "./ticketsRouter.js";
import {clearTmp} from "./clearTmp.js";
import cors from "cors"
import fs from "fs";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();

console.log("PATH RESOLVE", path.resolve());
console.log("DIR NAME", __dirname);

app.use(cors());

app.use("/tickets", ticketsRouter);

app.use((req, res, next) => {
    const fileId = req.url.slice(1);
    console.log(fileId, tickets);
    const ticket = tickets[fileId] || {};

    const fileNames = fs.readdirSync(path.join(__dirname, "tmp"));
    if (fileNames.includes(fileId)) {
        res.setHeader("Content-Disposition", `inline; filename="${ticket.originalName || "unnamed.pdf"}"`);
        res.sendFile(path.join(__dirname, "tmp", req.url.slice(1)));
    } else {
        next();
    }
});

app.use(express.static(path.join(__dirname, "..", "front", "build")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "front", "build", "index.html"));
});

const port = process.env.PORT || 7777;

app.listen(port, () => console.log("Listening on " + port));

process.on("exit", clearTmp)
