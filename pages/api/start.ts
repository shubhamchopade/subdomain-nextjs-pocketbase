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
  const { link, id = 1, projectId = 1, port = 30 } = req.query;
  console.log("repoLink: ", link);
  // const portNum = 3008;

  const dir = "/home/shubham/Code/monorepo/apps";

  const gitCloneCmd = `git clone ${link} ${dir}/${id}/${projectId}`;

  // Start the project
  log(chalk.bgYellow("Starting project on port >> ", port));
  executeCommand(`pwd`).then((output) => {
    console.log(output.stdout);
  });

  executeCommand(
    `cd ${dir}/${id}/${projectId} && yarn start -- -p ${port} \&`
  ).then((output) => {
    log(chalk.red("EXIT ", output.stdout, output.stderr));
  });
  // executeCommand(
  //   `cd ${dir}/${id}/${projectId} && PORT=${portNum} pnpm run start &`
  // ).then((output) => {
  //   log(chalk.red("EXIT ", output.stdout, output.stderr));
  // });

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

function executeCommandChild(command, args = []) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, { stdio: "pipe", shell: true });

    let stdout = "";
    let stderr = "";

    childProcess.stdout.on("data", (data) => {
      stdout += data.toString();
      process.stdout.write(data);
    });

    childProcess.stderr.on("data", (data) => {
      stderr += data.toString();
      process.stderr.write(data);
    });

    childProcess.on("error", (err) => {
      reject(
        new Error(
          `Command executeCommandChild "${command} ${args.join(
            " "
          )}" failed with error: ${err}`
        )
      );
    });

    childProcess.on("close", (code, signal) => {
      if (code !== 0) {
        reject(
          new Error(
            `Command "${command} ${args.join(
              " "
            )}" failed with code ${code} and signal ${signal}: ${stderr}`
          )
        );
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}
