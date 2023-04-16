import { spawn } from "child_process";

export function executeCommandChild(command: string, args: any) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, { stdio: "pipe", shell: true });

    let stdout = "";
    let stderr = "";

    childProcess.stdout.on("data", (data) => {
      stdout += data.toString();
      process.stdout.write(data);
    });

    childProcess.stderr.on("data", (data) => {
      stderr += data.toString();
      process.stderr.write(data);
    });

    childProcess.on("error", (err) => {
      reject({ err, stderr });
    });

    childProcess.on("close", (code, signal) => {
      if (code !== 0) {
        reject({ stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}
