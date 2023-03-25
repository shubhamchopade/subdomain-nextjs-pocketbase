import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../backend/node-multithreading";

const log = console.log;
const erB = chalk.bold.redBright;

type Data = {
    name: string;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { link, id = 1, projectId = 1, port = 3000, subdomain, framework } = req.query;
    console.log("repoLink: ", link);

    const dir = "/home/shubham/Code/monorepo/apps";

    // TODO: Run system ctl command to stop the services

    console.log(`deleting started at port ${port}`);

    // Get the process id
    executeCommandChild('lsof', [`-t`, `-i:${port}`])
        .then((pid: any) => {
            log(chalk.red(`PORT > ${port} - PID >`, pid.stdout));
            res.status(200).json({ data: "lsof" });

            // kill the process
            executeCommandChild('kill', ['-9', pid.stdout])
                .then((output: any) => {
                    log(chalk.red(`kill > ${output.stdout} -----`));

                }).catch(err => {
                    console.error("/api/stop - process does not exist", err)
                })

            // stop the project from systemctl
            executeCommandChild(
                `systemctl`, [`stop`, `$(systemd-escape`, `--template`, `techsapien@.service`, `"${projectId} ${port} ${id} ${framework}")`]
            ).then((output: any) => {
                console.log("Service stopped", output.stdout, output.stderr)
                res.status(200).json({ data: "service stopped" });
            }).catch((err) => {
                console.log("Service stop failed", err);
                res.status(400).json({ data: "service stop failed" });
            }
            );

        })
        // if the process does not exist
        .catch((err) => {
            res.status(400).json({ data: "app is already in stopped state" });
            log(erB("app is already in stopped state"));
        });



}