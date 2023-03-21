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
  const { link, id = 1, projectId = 1, port = 30, subdomain = "test" } = req.query;
  console.log("repoLink: ", link);
  const portNum = port + projectId + id;

  const dir = "/home/shubham/Code/monorepo/apps";

  const scriptLocation = '/home/shubham/Code/nginx-config/nginxsub.sh'

  // createNginxConf(`/etc/nginx/conf.d/${subdomain}.techsapien.dev.conf`)
  // test -f /etc/resolv.conf && echo "$FILE exists."


  // executeCommand(
  //   `test -f /etc/nginx/conf.d/${subdomain}.techsapien.dev.conf`
  // ).then((output) => {
  //   log(chalk.red("NGINX CONFIG ALREADY EXISTS "));

  // }).catch(e => {
  //   log(chalk.redBright("creating nginx config.. "));
  //   // // Create nginx file using custom script
  //   // executeCommandChild(
  //   //   `sh`, [`${scriptLocation}`, `${subdomain}`, `${port}`]
  //   // ).then((output) => {
  //   //   log(chalk.blue("Nginx entry created ", output.stdout, output.stderr));
  //   //   res.status(200).json({ data: "created nginx entry.." });
  //   // }).catch(e => {
  //   //   log(chalk.redBright("Error creating nginx entry, please try again", e));
  //   // })
  // })

  // // Create nginx file using custom script
  // executeCommand(`sh ${scriptLocation} ${subdomain} ${port}`).then((output) => {
  //   log(chalk.blue("Nginx entry created ", output.stdout, output.stderr));
  //   res.status(200).json({ data: "created nginx entry.." });
  // }).catch(e => {
  //   log(chalk.redBright("Error creating nginx entry, please try again", e));
  // })

  // Create nginx file using custom script
  executeCommandChild(
    `sh`, [`${scriptLocation}`, `${subdomain}`, `${port}`]
  ).then((output) => {
    log(chalk.blue("Nginx entry created ", output.stdout, output.stderr));
    res.status(200).json({ data: "created nginx entry.." });
  }).catch(e => {
    log(chalk.redBright("Error creating nginx entry, please try again", e));
  })

  // res.status(400).json({ data: "NGINX SUBDOMAIN END" });
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
