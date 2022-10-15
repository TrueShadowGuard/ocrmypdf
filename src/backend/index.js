import express from "express";
import * as path from "path";
import ticketsRouter from "./ticketsRouter.js";
import {clearTmp} from "./clearTmp.js";
import cors from "cors"

const app = express();

app.use(cors());

app.use("/tickets", ticketsRouter);

app.get("/a", (req, res) => {
    res.json(123);
})

app.use("/tmp", express.static(path.resolve("tmp")));

app.use(express.static(path.resolve("..", "front", "build")))

app.get("*", (req, res) => {
    res.sendFile(path.resolve("..", "front", "build", "index.html"));
});

const port = process.env.PORT || 7777;

app.listen(port, () => console.log("Listening on " + port));

process.on("exit", clearTmp)
