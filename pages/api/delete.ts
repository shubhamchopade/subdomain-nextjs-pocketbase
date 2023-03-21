// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";

import util from "util";
import { spawn } from "child_process";

const exec = util.promisify(require("child_process").exec);

const log = console.log;
const erB = chalk.bold.redBright;
const blu = chalk.bold.blue;

type Data = {
    name: string;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { link, id = 1, projectId = 1, port = 3000 } = req.query;
    console.log("repoLink: ", link);

    const dir = "/home/shubham/Code/monorepo/apps";

    console.log(`DELETING APP at port ${port}`);
    executeCommandChild('lsof', [`-t`, `-i:${port}`])
        .then((pid) => {
            log(chalk.bgBlue(`PORT > ${port} - PID >`, pid.stdout));
            res.status(200).json({ data: "lsof" });

            executeCommandChild('kill', ['-9', pid.stdout])
                .then(output => {
                    log(chalk.bgBlue(`kill > ${pid.stdout} -----`));
                }).catch(err => {
                    console.error("KILLING FAILED", err)
                })
        })
        // pnpm build failed
        .catch((err) => {
            res.status(400).json({ data: "DELETING APP failed" });
            log(erB("--------DELETING APP FAILED---------"));
        });
}

const executeCommand = async (cmd) => {
    try {
        const { stdout, stderr } = await exec(cmd);
        if (stderr) {
            console.error(`Command "${cmd}" produced error output: ${stderr}`);
        }
        return { stdout, stderr };
    } catch (err) {
        console.error(
            chalk.red.bold(`Error running command`),
            cmd,
            chalk.red(err.stderr)
        );
        throw err;
    }
};

function executeCommandChild(command, args = []) {
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
