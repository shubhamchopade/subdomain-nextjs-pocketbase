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
  const { link, id = 1, projectId = 1, port = 3, statusId } = req.query;
  const dir = "/home/shubham/Code/monorepo/apps";
  const pb = new PocketBase("https://pocketbase.techsapien.dev");

  console.log("clone started")
  try {
    executeCommandChild(`git`, ['clone', `${link}`, `${dir}/${id}/${projectId}`]).then(
      (childRes: any) => {
        log(chalk.bgGreen(`Repo cloned - ${link}`, childRes.stderr));
        pb.collection('projectStatus').update(statusId, {
          status: "cloned",
          cloned: true,
          logClone: "Cloned successfully"
        })
        res.status(200).json({ data: `Repo cloned ${link}`, logs: JSON.stringify(childRes.stdout), });
      }
    ).catch((err) => {
      log(erB("--------git clone failed---------", err.stderr));
      pb.collection('projectStatus').update(statusId, {
        status: "clone failed",
        cloned: false,
        logClone: "Cloning failed"
      })
      res.status(400).json({ data: `git clone failed, file already exists` });
    });

  } catch (e) {
    console.error(e)
    res.status(400).json({ data: `git clone failed, file already exists` });
  }
}
