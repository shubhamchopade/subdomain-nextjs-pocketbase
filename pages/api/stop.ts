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
    const { link, id = 1, projectId = 1, port = 3000, subdomain } = req.query;
    console.log("repoLink: ", link);

    const dir = "/home/shubham/Code/monorepo/apps";

    // TODO: Run system ctl command to stop the services

    console.log(`DELETING APP at port ${port}`);
    // Get the process id
    executeCommandChild('lsof', [`-t`, `-i:${port}`])
        .then((pid) => {
            log(chalk.bgBlue(`PORT > ${port} - PID >`, pid.stdout));
            res.status(200).json({ data: "lsof" });

            // kill the process
            executeCommandChild('kill', ['-9', pid.stdout])
                .then(output => {
                    log(chalk.bgBlue(`kill > ${output.stdout} -----`));

                }).catch(err => {
                    console.error("KILLING FAILED", err)
                })

        })
        // pnpm build failed
        .catch((err) => {
            res.status(400).json({ data: "Project is currently inactive" });
            log(erB("--------Get the process id FAILED---------"));
        });
}