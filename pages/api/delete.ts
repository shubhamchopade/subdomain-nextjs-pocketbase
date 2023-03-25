import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../backend/node-multithreading";
import PocketBase from "pocketbase";


const log = console.log;
const erB = chalk.bold.redBright;

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { link, id = 1, projectId = 1, port = 3000, subdomain, framework } = req.query;
    console.log("repoLink: ", link);

    const dir = "/home/shubham/Code/monorepo/apps";

    const projectPath = `${dir}/${id}/${projectId}`;

    console.log(erB(`DELETING APP at port ${port}`));

    const pb = new PocketBase("https://pocketbase.techsapien.dev");

    // Add a promise.all() to execute all the commands at once

    // delete from pocketbase
    const deleteProjectPocketbase = pb.collection("projects").delete(projectId);

    // DELETE config file at nginx
    const deleteNginxConfig = executeCommandChild('rm', ['-f', `/etc/nginx/techsapien.d/${subdomain}.techsapien.dev.conf`])
    // .then((res: any) => {
    //     log(chalk.bgGreen(`DELETED ${subdomain}.techsapien.dev.conf`, res.stdout));
    // }).catch(e => {
    //     console.error("DELETING nginx/chsapien.d failed", e)
    // })

    // delete the project files from /app 
    const deleteProjectFiles = executeCommandChild('rm', ['-rf', projectPath])
    // .then((output: any) => {
    //     log(chalk.bgBlue(`deletes the project files from /app SUCCESS`));
    //     res.status(200).json({ data: "deleted project files" });
    // }).catch(err => {
    //     console.error("delete the project files from /app FAILED", err)
    //     res.status(400).json({ data: "delete error" });
    // })

    // disable the project from systemctl
    const disableProjectSystem = executeCommandChild(`systemctl`, [`disable`, `$(systemd-escape`, `--template`, `techsapien@.service`, `"${projectId} ${port} ${id} ${framework}")`])
    // ).then((output: any) => {
    //     console.log("Service disabled", output.stdout, output.stderr)
    //     res.status(200).json({ data: "service disabled" });
    // }).catch((err) => {
    //     console.log("Service disabled failed", err);
    //     res.status(400).json({ data: "service disabled failed" });
    // }
    // );

    // Add a Promise.all() to execute all the commands at once
    Promise.all([
        deleteNginxConfig,
        deleteProjectFiles,
        disableProjectSystem,
        deleteProjectPocketbase
    ]).then((output) => {
        console.log("All commands executed", output);
        res.status(200).json({ data: "all commands executed" });
    }).catch((err) => {
        console.log("Some commands failed", err);
        res.status(400).json({ data: "some commands failed" });
    })
}