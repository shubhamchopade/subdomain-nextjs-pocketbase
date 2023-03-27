import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../backend/node-multithreading";
import PocketBase from 'pocketbase'

const log = console.log;
const erB = chalk.bold.redBright;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { link, id = 1, projectId = 1, port = 3, statusId } = req.query;

  const dir = process.env.NEXT_PUBLIC_LOCAL_PATH_TO_PROJECTS;
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  console.log("Build Started");
  executeCommandChild('cd', [`${dir}/${id}/${projectId}`, `&&`, `yarn build`])
    .then((output: any) => {
      pb.collection('projectStatus').update(statusId, {
        built: true,
        current: "build complete",
        logBuild: JSON.stringify(output.stdout)
      })

      log(chalk.bgBlue("build output ", output.stdout, output.stderr));

      res.status(200).json({
        data: `build success for ${projectId}`,
        logs: JSON.stringify(output.stdout),
      })
    })
    .catch((err) => {
      pb.collection('projectStatus').update(statusId, {
        built: false,
        current: "build failed",
        logBuild: JSON.stringify(err.stderr)
      })
      log(erB(`build failed for ${projectId}`, err.stderr));
      res.status(400).json({ data: `build failed for ${projectId}`, logs: JSON.stringify(err.stderr) });
    });
}


