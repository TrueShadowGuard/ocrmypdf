export default class Ticket {
    static statuses = {
        IN_PROGRESS: "IN PROGRESS",
        SUCCESS: "SUCCESS",
        ERROR: "ERROR"
    }

    constructor(file) {
        this.status = Ticket.statuses.IN_PROGRESS;
        this.id = file.filename + ".ocr";
        this.originalName = file.originalName;

        this.inputName = file.filename;
        this.outputName = file.filename + ".ocr"

        this.inputPath = file.path;
        this.outputPath = file.path + ".ocr";
    }
}