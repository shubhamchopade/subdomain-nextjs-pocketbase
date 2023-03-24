// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../backend/node-multithreading";


const log = console.log;

export interface Service {
  projectId: string;
  port: string;
  userId: string;
  framework: string;
}


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { link, id = 1, projectId = 1, port = 30, framework } = req.query;
  const dir = "/home/shubham/Code/monorepo/apps";

  // Start the project
  // log(chalk.bgYellow("Starting project on port >> ", port));
  //  TODO: run the systemctl command to start this project


  executeCommandChild(
    `systemctl`, [`start`, `$(systemd-escape`, `--template`, `techsapien@.service`, `"${projectId} ${port} ${id} ${framework}")`]
  ).then((output: any) => {
    console.log("Service created - project online", output.stdout, output.stderr)
    res.status(200).json({ name: "service created" });
  }).catch((err) => {
    console.log("Service create failed", err);
    res.status(400).json({ name: "service failed" });
  }
  );

  // res.status(200).json({ name: "B" });
}
