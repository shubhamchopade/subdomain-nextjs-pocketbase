import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../backend/node-multithreading";


const log = console.log;
const erB = chalk.bold.redBright;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { link, id = 1, projectId = 1, port = 3 } = req.query;
  console.log("repoLink: ", link);
  const dir = "/home/shubham/Code/monorepo/apps";

  console.log("Build Started");
  executeCommandChild('cd', [`${dir}/${id}/${projectId}`, `&&`, `yarn build`])
    .then((output: any) => {
      // TODO: Get the output of the build command and send it to the client
      log(chalk.bgBlue("build output ", output.stdout, output.stderr));
      res.status(200).json({
        data: `build success for ${projectId}`,
        logs: JSON.stringify(output.stdout),
      })
    })
    .catch((err) => {
      res.status(400).json({ data: `build failed for ${projectId}`, logs: JSON.stringify(err.stderr) });
      log(erB(`build failed for ${projectId}`, err.stderr));
    });
}


