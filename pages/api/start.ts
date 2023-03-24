// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../components/utils/build-helpers";


const log = console.log;


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { link, id = 1, projectId = 1, port = 30 } = req.query;
  const dir = "/home/shubham/Code/monorepo/apps";

  // Start the project
  log(chalk.bgYellow("Starting project on port >> ", port));
  //  TODO: run the systemctl command to start this project

  // executeCommandChild(
  //   `cd` `${dir}/${id}/${projectId}` `&&` `yarn` `start` `--` `-p ${port} \&`
  // ).then((output: any) => {
  //   log(chalk.red("EXIT ", output.stdout, output.stderr));
  // });

  res.status(200).json({ name: "John Doe" });
}