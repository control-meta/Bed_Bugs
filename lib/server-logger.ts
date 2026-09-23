import fs from "fs";
import path from "path";

const LOG_FILE_PATH = path.join(process.cwd(), ".auto_publish_terminal.log");
const MAX_LOG_LINES = 1000;

function stripAnsiCodes(str: string): string {
  return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "");
}

export function initializeSystemLogger() {
  if ((global as any).__SYSTEM_LOGGER_INITIALIZED__) {
    return;
  }
  (global as any).__SYSTEM_LOGGER_INITIALIZED__ = true;

  const originalStdoutWrite = process.stdout.write.bind(process.stdout);
  const originalStderrWrite = process.stderr.write.bind(process.stderr);

  function appendLog(chunk: string) {
    try {
      const cleanChunk = stripAnsiCodes(chunk);
      
      // Ignore harmless Next.js dev server memory leak warnings on Gzip streams
      if (cleanChunk.includes("MaxListenersExceededWarning") || cleanChunk.includes("node --trace-warnings")) {
        return;
      }
      
      fs.appendFileSync(LOG_FILE_PATH, cleanChunk, "utf8");

      // Rotate log file occasionally
      if (Math.random() < 0.05) {
        const content = fs.readFileSync(LOG_FILE_PATH, "utf8");
        const lines = content.split("\n");
        if (lines.length > MAX_LOG_LINES) {
          fs.writeFileSync(LOG_FILE_PATH, lines.slice(-MAX_LOG_LINES).join("\n"), "utf8");
        }
      }
    } catch (err) {
      // Fail silently if unable to write
    }
  }

  process.stdout.write = (chunk: any, encoding?: any, callback?: any) => {
    appendLog(chunk.toString());
    return originalStdoutWrite(chunk, encoding, callback);
  };

  process.stderr.write = (chunk: any, encoding?: any, callback?: any) => {
    appendLog(chunk.toString());
    return originalStderrWrite(chunk, encoding, callback);
  };
}

// Dummy export to prevent breaking existing imports while we refactor them
export const serverLogger = {
  log: (...args: any[]) => console.log(...args),
  info: (...args: any[]) => console.info(...args),
  warn: (...args: any[]) => console.warn(...args),
  error: (...args: any[]) => console.error(...args),
};
