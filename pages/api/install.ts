// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../backend/node-multithreading";


const log = console.log;
const erB = chalk.bold.redBright;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { link, id = 1, projectId = 1, port = 3 } = req.query;
  const dir = "/home/shubham/Code/monorepo/apps";

  // get cwd
  executeCommandChild(`cd`, [`${dir}/${id}/${projectId}`, `&&`, `pwd`]).then((output: any) => {
    log(chalk.green("pwd >> ", output.stdout, output.stderr));
  });

  // Install dependencies using npm
  executeCommandChild('cd', [`${dir}/${id}/${projectId}`, `&&`, `yarn install`])
    .then((output: any) => {
      log(chalk.bgMagenta("npm installed >> ", output.stdout, output.stderr));
      res.status(200).json({ data: "Installation Complete", logs: JSON.stringify(output.stdout) });
    })
    .catch((err) => {
      log(erB("--------npm install failed---------"));
      res.status(400).json({ data: "Installation Failed" });
    });
}