// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import PocketBase from 'pocketbase'
import { executeCommandChild } from "../../backend/node-multithreading";


const log = console.log;

export interface Service {
  projectId: string;
  port: string;
  userId: string;
  framework: string;
}

/**
 * Gets port and framework by looking into the project folder structure, then creates a service and returns the status
 * @param req link, id, projectId, port, statusId
 * @param res starts the project and returns the status
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { link, id = 1, projectId = 1, statusId, subdomain } = req.query;
  const dir = "/home/shubham/Code/monorepo/apps";
  const pb = new PocketBase("https://pocketbase.techsapien.dev");

  try {
    // Get framework
    pb.collection('projects').getOne(projectId).then((project: any) => {
      const { port, framework } = project;
      console.log("port, framework", port, framework)
      executeCommandChild(
        `systemctl`, [`start`, `$(systemd-escape`, `--template`, `techsapien@.service`, `"${projectId} ${port} ${id} ${framework}")`]
      ).then((output: any) => {
        console.log("Service created - project online", output.stdout, output.stderr)
        pb.collection('projectStatus').update(statusId, {
          isOnline: true,
          stopped: false,
          current: "project online",
          logStart: `🎉 Project is ONLINE - ${subdomain}.techsapien.dev`
        })
        res.status(200).json({ name: "service created" });
      }).catch((err) => {
        console.log("Service create failed", err);
        pb.collection('projectStatus').update(statusId, {
          isOnline: false,
          stopped: true,
          current: "project stopped",
          logStart: `👀 Project could not start, please try again later.`
        })
        res.status(400).json({ name: "service failed" });
      }
      );
    }).catch((err) => {

    })
  } catch (err) {
    console.log("Service create failed", err);
    pb.collection('projectStatus').update(statusId, {
      isOnline: false,
      stopped: true,
      current: "project stopped",
      logStart: `👀 Project could not start, please try again later.`
    })
    res.status(400).json({ name: "service failed" });

  }


  // Get the framework




  // res.status(200).json({ name: "B" });
}
