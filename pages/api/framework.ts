import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../backend/node-multithreading";

const log = console.log;


export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { link, id = 1, projectId = 1, port = 3 } = req.query;

    const dir = "/home/shubham/Code/monorepo/apps";
    const scriptLocation = '/home/shubham/Code/nginx-config/get-framework.sh'

    // Create nginx file using custom script
    executeCommandChild(
        `sh`, [`${scriptLocation}`, `${dir}/${id}/${projectId}`]
    ).then((output: any) => {
        log(chalk.blue("framework detected ", output.stdout, output.stderr));
        res.status(200).json({ data: output.stdout });
    }).catch(e => {
        log(chalk.redBright("Error creating framework, please try again", e));
        res.status(200).json({ data: "detected framework failed.." });
    })

}

// Path: pages/api/framework.ts