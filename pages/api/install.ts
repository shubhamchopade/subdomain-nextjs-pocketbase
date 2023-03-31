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
  const { link, id = 1, projectId = 1, port = 3, statusId, metricId } = req.query;
  const dir = process.env.NEXT_PUBLIC_LOCAL_PATH_TO_PROJECTS;
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  // Install dependencies using npm
  executeCommandChild('cd', [`${dir}/${id}/${projectId}`, `&&`, `sudo yarn install`])
    .then((output: any) => {
      // log(chalk.bgYellow("install output -", output.stdout, output.stderr));
      const timeInstall = output.stdout.split("Done in ")[1].split("s")[0];
      log(chalk.bgGreen("install time -", timeInstall));
      pb.collection('projectStatus').update(statusId, {
        installed: true,
        current: "installation complete",
        logInstall: JSON.stringify(output.stdout)
      })
      pb.collection('deployMetrics').update(metricId, {
        timeInstall
      })
      res.status(200).json({ data: "Installation Complete", logs: JSON.stringify(output.stdout) });
    })
    .catch((err) => {
      log(erB("--------install failed---------", err.stderr));
      pb.collection('projectStatus').update(statusId, {
        installed: false,
        current: "installation failed",
        logInstall: JSON.stringify(err.stderr)
      })
      res.status(400).json({ data: "Installation Failed", logs: JSON.stringify(err.stderr) });
    });
}