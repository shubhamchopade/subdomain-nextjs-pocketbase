import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../components/utils/build-helpers";

const log = console.log;
const erB = chalk.bold.redBright;

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { link, id = 1, projectId = 1, port = 3000, subdomain } = req.query;
    console.log("repoLink: ", link);

    const dir = "/home/shubham/Code/monorepo/apps";

    const projectPath = `${dir}/${id}/${projectId}`;

    console.log(erB(`DELETING APP at port ${port}`));

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
                    console.error("killing process failed", err)
                })
        })
        // pnpm build failed
        .catch((err) => {
            res.status(400).json({ data: "deleting app failed" });
            log(erB("--------Get the process id FAILED---------"));
        });

    // DELETE config file at nginx
    executeCommandChild('rm', ['-f', `/etc/nginx/conf.d/${subdomain}.techsapien.dev.conf`])
        .then((res: any) => {
            log(chalk.bgGreen(`DELETED ${subdomain}.techsapien.dev.conf`, res.stdout));
        }).catch(e => {
            console.error("DELETING nginx/conf.d failed", e)
        })

    // delete the project files from /app 
    executeCommandChild('rm', ['-rf', projectPath])
        .then((output: any) => {
            log(chalk.bgBlue(`delete the project files from /app ${output.stdout} -----`));
        }).catch(err => {
            console.error("delete the project files from /app FAILED", err)
        })

    return res.status(200).json({ data: "Project deleted" })
}