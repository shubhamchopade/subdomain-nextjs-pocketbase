// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../components/utils/build-helpers";

const log = console.log;
const erB = chalk.bold.redBright;


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { link, id = 1, projectId = 1, port = 3 } = req.query;
  const dir = "/home/shubham/Code/monorepo/apps";

  console.log("DEV STARTED");
  executeCommandChild('cd', [`${dir}/${id}/${projectId}`, `&&`, `yarn dev`, '--', '-p', port])
    .then((output: any) => {
      log(chalk.bgBlue("pnpm dev >> ", output.stdout, output.stderr));
      res.status(200).json({ data: "dev Success!!!!" });
    })
    // pnpm dev failed
    .catch((err) => {
      res.status(400).json({ data: "dev failed" });
      log(erB("--------pnpm dev failed---------"));
    });
}