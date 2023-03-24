import { spawn } from "child_process";

// generate a random numbers between 1000 and 9999
export function generateRandomNumber(): number {
    return Math.floor(Math.random() * 8999 + 1000);
}

export const getRepos = async (username: string) => {
    const res = await fetch(
        `https://api.github.com/users/${username}/repos`
    );
    const repos = await res.json();
    return repos;
};


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
            reject(
                new Error(
                    `Command executeCommandChild "${command} ${args.join(
                        " "
                    )}" failed with error: ${err}`
                )
            );
        });

        childProcess.on("close", (code, signal) => {
            if (code !== 0) {
                reject(
                    new Error(
                        `Command "${command} ${args.join(
                            " "
                        )}" failed with code ${code} and signal ${signal}: ${stderr}`
                    )
                );
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}
