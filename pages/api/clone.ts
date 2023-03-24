import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../backend/node-multithreading";

const log = console.log;
const erB = chalk.bold.redBright;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { link, id = 1, projectId = 1, port = 3 } = req.query;
  const dir = "/home/shubham/Code/monorepo/apps";

  console.log("clone started")
  try {
    executeCommandChild(`git`, ['clone', `${link}`, `${dir}/${id}/${projectId}`]).then(
      (childRes: any) => {
        log(chalk.bgGreen(`Repo cloned - ${link}`, childRes.stderr));
        res.status(200).json({ data: `Repo cloned ${link}` });
      }
    ).catch((err) => {
      log(erB("--------git clone failed---------"));
      res.status(400).json({ data: `git clone failed` });
    });

  } catch (e) {
    console.error(e)
  }
}
