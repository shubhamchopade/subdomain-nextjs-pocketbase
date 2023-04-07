import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../backend/node-multithreading";
import PocketBase from "pocketbase";

const log = console.log;
const erB = chalk.bold.redBright;

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const {
    link,
    id = 1,
    projectId = 1,
    subdomain,
    framework,
    statusId,
  } = req.query;

  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  // Get the port and
  pb.collection("projects")
    .getOne(projectId)
    .then((portRes: any) => {
      const port = portRes[0].port;
      console.log(`deleting started at port ${port}`);
      // Get the process id by listing the ports
      // TODO - use pm2 instead of systemd
      executeCommandChild("lsof", [`-t`, `-i:${port}`])
        .then((pid: any) => {
          log(chalk.red(`PORT > ${port} - PID >`, pid.stdout));
          // TODO - use pm2 instead of systemd
          // stop the project from systemctl
          executeCommandChild(`systemctl`, [
            `stop`,
            `$(systemd-escape`,
            `--template`,
            `techsapien@.service`,
            `"${projectId} ${port} ${id} ${framework}")`,
          ])
            .then((output: any) => {
              console.log("Service stopped", output.stdout, output.stderr);
              // res.status(200).json({ data: "service stopped" });
            })
            .catch((err) => {
              console.log("Service stop failed", err);
              // res.status(400).json({ data: "service stop failed" });
            });

          // update the project status
          pb.collection("projectStatus").update(statusId, {
            stopped: true,
            isOnline: false,
            current: "stopped",
            logStop: "Application stopped, resources released",
          });

          console.log(`${projectId} ${port} ${id} ${framework}`);

          // TODO - use pm2 instead of systemd
          // kill the process using process id obtained from lists of ports
          executeCommandChild("kill", ["-9", `${pid.stdout}`])
            .then((output: any) => {
              log(chalk.red(`kill > ${output.stdout} -----`));
              res.status(200).json({ data: "service stopped" });
            })
            .catch((err) => {
              console.error("/api/stop - process does not exist", err);
              res.status(400).json({ data: "service stop failed" });
            });
        })
        // if the process does not exist
        .catch((err) => {
          pb.collection("projectStatus").update(statusId, {
            stopped: false,
            isOnline: false,
            current: "deleting error",
            logStop: "Application could not be stopped",
          });
          log(erB("app state - STOPPED"));
          res.status(400).json({ data: "app state - STOPPED" });
        });
    });
}
