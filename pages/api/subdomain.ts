import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../backend/node-multithreading";


// TODO - Add a description of the function

const log = console.log;
const erB = chalk.bold.redBright;
const blu = chalk.bold.blue;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { link, id = 1, projectId = 1, port = 30, subdomain = "test" } = req.query;
  console.log("repoLink: ", link);
  const scriptLocation = '/home/shubham/Code/system-scripts/nginx-techsapien.sh'


  executeCommandChild(
    `sh`, [`${scriptLocation}`, `${subdomain}`, `${port}`, `${id}`]
  ).then((output: any) => {
    log(chalk.blue("Nginx entry created ", output.stdout, output.stderr));
    res.status(200).json({ data: "created nginx entry.." });
  }).catch(e => {
    log(chalk.redBright("Error creating nginx entry, please try again", e));
  })
}