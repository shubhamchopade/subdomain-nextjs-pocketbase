import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../backend/node-multithreading";
import PocketBase from 'pocketbase'

const log = console.log;
const erB = chalk.bold.redBright;

/**
 * Clone api function first clones the repo and then detects the framework then returns
 * @param req link, id, projectId, port, statusId
 * @param res if success, update status to cloned
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { link, id = 1, projectId = 1, port = 3, statusId } = req.query;
  const dir = "/home/shubham/Code/monorepo/apps";
  const scriptLocation = '/home/shubham/Code/nginx-config/get-framework.sh'
  const pb = new PocketBase("https://pocketbase.techsapien.dev");


  try {
    executeCommandChild(`git`, ['clone', `${link}`, `${dir}/${id}/${projectId}`]).then(
      (childRes: any) => {
        log(chalk.bgGreen(`Repo cloned - ${link}`, childRes.stdout, childRes.stderr));
        pb.collection('projectStatus').update(statusId, {
          current: "cloned",
          cloned: true,
          logClone: "cloned successfully"
        })

        // Create nginx file using custom script
        executeCommandChild(
          `sh`, [`${scriptLocation}`, `${dir}/${id}/${projectId}`]
        ).then((output: any) => {
          log(chalk.bgGreenBright.black("framework detected ", output.stdout, output.stderr));

          // Update the framework in the database
          pb.collection('projects').update(projectId, { framework: output.stdout })


        }).catch(e => {
          log(chalk.redBright("unsupported framework detected", e));
        })

        // Return the success response
        res.status(200).json({ data: `Repo cloned ${link}`, logs: JSON.stringify(childRes.stdout) });
      }
    ).catch((err) => {
      log(erB("git clone skipped", err.stderr));
      // Update the status in the database
      pb.collection('projectStatus').update(statusId, {
        current: "clone skipped",
        cloned: true,
        logClone: "git clone skipped, file already exists"
      })
      // Return the error response
      res.status(400).json({ data: `git clone failed, file already exists` });
    });

  } catch (e) {
    console.error(e)
    // Update the status in the database
    pb.collection('projectStatus').update(statusId, {
      current: "clone failed",
      cloned: false,
      logClone: "git clone failed, file already exists"
    })
    // Return the error response
    res.status(400).json({ data: `git clone failed, file already exists` });
  }
}
