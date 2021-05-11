const { createLogger, format, transports } = require("winston");
const { combine, colorize, timestamp, prettyPrint, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp}: ${level}\n  => ${message}`;
});

let logTransport;
let logLevel;
if (process.env.NODE_ENV === "development") {
  logTransport = [new transports.Console()];
  logLevel = "info";
} else {
  logTransport = [new transports.File({ filename: "logFile.log" })];
  logLevel = "error";
}

const logger = createLogger({
  level: logLevel,
  format: combine(
    format.colorize(),
    timestamp({ format: "HH:mm:ss" }),
    myFormat,
    format.errors({ stack: true })
  ),
  transports: logTransport,
});

module.exports = logger;
