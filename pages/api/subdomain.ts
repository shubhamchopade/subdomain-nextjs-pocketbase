import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../backend/node-multithreading";
import PocketBase from 'pocketbase'

// TODO - Add a description of the function

const log = console.log;
const erB = chalk.bold.redBright;
const blu = chalk.bold.blue;



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { link, id = 1, projectId = 1, port = 30, subdomain = "test", statusId } = req.query;
  console.log("id: ", id);
  const scriptLocation = '/home/shubham/Code/system-scripts/nginx-techsapien.sh'
  console.log("subdomain", statusId)
  const pb = new PocketBase("https://pocketbase.techsapien.dev");

  executeCommandChild(
    `sh`, [`${scriptLocation}`, `${subdomain}`, `${port}`, `${id}`]
  ).then((output: any) => {
    log(chalk.blue("Nginx entry created ", output.stdout, output.stderr));
    pb.collection('projectStatus').update(statusId, {
      subdomain: true,
      current: "subdomain created",
      logSubdomain: `🔥 Subdomain assigned successfully - ${subdomain}.techsapien.dev`
    })
    res.status(200).json({ data: "created nginx entry.." });
  }).catch(e => {
    pb.collection('projectStatus').update(statusId, {
      subdomain: true,
      current: "subdomain failed",
      logSubdomain: "Uh Oh! Subdomain already assigned, please choose another one. 🤔"
    })
    log(chalk.redBright("Error creating nginx entry, please try again", e));
    res.status(400).json({ data: "Error assinging subdomain" });
  })
}