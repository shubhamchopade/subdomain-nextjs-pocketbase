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
  const { link, id = 1, projectId = 1, subdomain, statusId } = req.query;
  const dir = process.env.NEXT_PUBLIC_LOCAL_PATH_TO_PROJECTS;

  const projectPath = `${dir}/${id}/${projectId}`;

  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  pb.collection("projects")
    .getOne(projectId)
    .then((project: any) => {
      const { port, framework } = project;
      console.log(erB(`DELETING APP at port ${port}`));

      // disable the project from systemctl
      executeCommandChild(`systemctl`, [
        `disable`,
        `$(systemd-escape`,
        `--template`,
        `techsapien@.service`,
        `"${projectId} ${port} ${id} ${framework}")`,
      ])
        .then(() => {
          // Update status of project
          pb.collection("projectStatus").update(statusId, {
            isOnline: false,
            stopped: true,
            current: "project inactive",
          });

          // DELETE config file at nginx
          executeCommandChild("rm", [
            "-f",
            `/etc/nginx/techsapien.d/${id}/${subdomain}.techsapien.dev.conf`,
          ]);

          // delete the project files from /app
          executeCommandChild("rm", ["-rf", projectPath]);

          // delete from pocketbase
          pb.collection("projects").delete(projectId);

          res.status(200).json({ name: "App Deleted" });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ name: "App could not be deleted" });
        });
    })
    .catch((err) => {
      console.log("Could not delete the app", err);
      res.status(400).json({ name: "service failed" });
    });
}
