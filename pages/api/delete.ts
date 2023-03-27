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
    const { link, id = 1, projectId = 1, subdomain, statusId } = req.query;

    const dir = "/home/shubham/Code/monorepo/apps";

    const projectPath = `${dir}/${id}/${projectId}`;


    const pb = new PocketBase("https://pocketbase.techsapien.dev");


    pb.collection('projects').getOne(projectId).then((project: any) => {
        const { port, framework } = project;
        console.log(erB(`DELETING APP at port ${port}`));

        // DELETE config file at nginx
        executeCommandChild('rm', ['-f', `/etc/nginx/techsapien.d/${subdomain}.techsapien.dev.conf`])

        // delete the project files from /app 
        executeCommandChild('rm', ['-rf', projectPath])

        // disable the project from systemctl
        executeCommandChild(`systemctl`, [`disable`, `$(systemd-escape`, `--template`, `techsapien@.service`, `"${projectId} ${port} ${id} ${framework}")`])

        // delete from pocketbase
        pb.collection("projects").delete(projectId);

        // Update status of project
        pb.collection('projectStatus').update(statusId, {
            isOnline: false,
            stopped: true,
            current: "project inactive",
        })

        res.status(200).json({ name: "App Deleted" });

    }).catch((err) => {
        console.log("Could not delete the app", err);
        res.status(400).json({ name: "service failed" });
    })

}