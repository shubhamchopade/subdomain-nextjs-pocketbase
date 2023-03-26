// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../backend/node-multithreading";
import PocketBase from 'pocketbase'

const log = console.log;
const erB = chalk.bold.redBright;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { link, id = 1, projectId = 1, port = 3, statusId } = req.query;
  const dir = "/home/shubham/Code/monorepo/apps";
  const pb = new PocketBase("https://pocketbase.techsapien.dev");

  // get cwd
  // executeCommandChild(`cd`, [`${dir}/${id}/${projectId}`, `&&`, `pwd`]).then((output: any) => {
  //   log(chalk.green("pwd >> ", output.stdout, output.stderr));
  // });

  // Install dependencies using npm
  executeCommandChild('cd', [`${dir}/${id}/${projectId}`, `&&`, `yarn install`])
    .then((output: any) => {
      log(chalk.bgMagenta("install output -", output.stdout, output.stderr));
      pb.collection('projectStatus').update(statusId, {
        install: true,
        current: "installation complete",
        logInstall: JSON.stringify(output.stdout)
      })
      res.status(200).json({ data: "Installation Complete", logs: JSON.stringify(output.stdout) });
    })
    .catch((err) => {
      log(erB("--------install failed---------", err.stderr));
      pb.collection('projectStatus').update(statusId, {
        install: false,
        current: "installation failed",
        logInstall: JSON.stringify(err.stderr)
      })
      res.status(400).json({ data: "Installation Failed", logs: JSON.stringify(err.stderr) });
    });
}