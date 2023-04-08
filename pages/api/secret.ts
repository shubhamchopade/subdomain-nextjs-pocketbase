import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../backend/node-multithreading";
import PocketBase from "pocketbase";

const log = console.log;
const erB = chalk.bold.redBright;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const {
    link,
    id = 1,
    projectId = 1,
    port = 3,
    statusId,
    metricId,
  } = req.query;
  const dir = process.env.NEXT_PUBLIC_LOCAL_PATH_TO_PROJECTS;
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  const payload = req.body;
  const secrets = payload.data;
  console.log(JSON.stringify(secrets));

  executeCommandChild("cd", [
    `${dir}/${id}/${projectId}`,
    `&&`,
    `echo "${secrets}" | sudo tee .env`,
  ])
    .then((output: any) => {
      // console.log(output)
      res.status(200).json({ data: "Secrets added successfully" });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ data: "Secrets adding failed. Internal Server Error." });
    });
}
