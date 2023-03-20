// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";

import util from "util";
import { spawn } from "child_process";

const exec = util.promisify(require("child_process").exec);

const log = console.log;
const erB = chalk.bold.redBright;
const blu = chalk.bold.blue;

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { link, id = 1, projectId = 1, port = 3 } = req.query;
  console.log("repoLink: ", link);
  const portNum = port + projectId + id;

  const dir = "/home/shubham/Code/monorepo/apps";

  const gitCloneCmd = `git clone ${link} ${dir}/${id}/${projectId}`;

  executeCommand(`ls ${dir}`)
    .then((output) => {
      log(blu("git clone parent >> ", output.stdout, output.stderr));
      executeCommand(`git clone ${link} ${dir}/${id}/${projectId}`).then(
        (childRes) => {
          log(chalk.bgGreen(`Repo cloned ${link} >> `, childRes.stderr));
        }
      );
    })
    // parent ls failed
    .catch((err) => {
      log(erB("--------git clone failed---------"));
    });

  res.status(200).json({ name: "John Doe" });
}

const executeCommand = async (cmd) => {
  try {
    const { stdout, stderr } = await exec(cmd);
    if (stderr) {
      console.error(`Command "${cmd}" produced error output: ${stderr}`);
    }
    return { stdout, stderr };
  } catch (err) {
    console.error(
      chalk.red.bold(`Error running command`),
      cmd,
      chalk.bgRed(err.stderr)
    );
    throw err;
  }
};
