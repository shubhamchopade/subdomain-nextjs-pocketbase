import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../backend/node-multithreading";
import PocketBase from "pocketbase";

const log = console.log;
const erB = chalk.bold.redBright;
const blu = chalk.bold.blue;

/**
 * Assigns a subdomain to the project according to the project name and also assigns a port if not already in use
 * @param req link, id, projectId, port, statusId
 * @param res if subdomain is available, creates a nginx entry and returns the status
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const {
    link,
    id = 1,
    projectId = 1,
    statusId,
    subdomain = "test",
  } = req.query;
  const scriptLocation =
    "/home/shubham/Code/system-scripts/nginx-techsapien.sh";
  // console.log("subdomain", statusId)
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  // generate a random numbers between 1000 and 9999
  const randomPort = Math.floor(Math.random() * 8999 + 1000);

  // Check if this port is already in use by checking database, if yes, generate a new one

  pb.collection("subdomains")
    .getFirstListItem(`port="${randomPort}"`)
    .then((res: any) => {
      pb.collection("projectStatus").update(statusId, {
        subdomain: true,
        current: "subdomain failed",
        logSubdomain:
          "Uh Oh! Subdomain already assigned, please choose another one. 🤔",
      });
      console.log(res);
      log(chalk.redBright("Error creating nginx entry, please try again"));
      res.status(400).json({ data: "Error assinging subdomain" });
    })
    .catch(() => {
      // If port is not in use, create a new entry in the database
      pb.collection("subdomains")
        .create({ projectId, port: randomPort, name: subdomain })
        .then((subdomainRes: any) => {
          pb.collection("projects").update(projectId, { port: randomPort });
          // Create a nginx entry using custom script
          executeCommandChild(`sh`, [
            `${scriptLocation}`,
            `${subdomain}`,
            `${randomPort}`,
            `${id}`,
          ])
            .then((output: any) => {
              log(
                chalk.blue("Nginx entry created ", output.stdout, output.stderr)
              );
              // Update the status in the database
              pb.collection("projectStatus").update(statusId, {
                subdomain: true,
                current: "subdomain created",
                logSubdomain: `🔥 Subdomain assigned successfully - ${subdomain}.techsapien.dev`,
              });
              res.status(200).json({ data: "created nginx entry.." });
            })
            .catch((e) => {
              // Error creating nginx entry
              pb.collection("projectStatus").update(statusId, {
                subdomain: true,
                current: "subdomain failed",
                logSubdomain:
                  "Uh Oh! Subdomain already assigned, please choose another one. 🤔",
              });
              log(
                chalk.redBright(
                  "Error creating nginx entry, please try again",
                  e
                )
              );
              res.status(400).json({ data: "Error assinging subdomain" });
            });
        })
        .catch((err: any) => {
          console.log("error", err);
          res.status(400).json({ data: "Error assinging subdomain, exited" });
        });
    });
}
