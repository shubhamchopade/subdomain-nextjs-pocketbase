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
    currentSubdomain,
    newSubdomain,
    subdomainId,
    framework,
    port,
  } = req.query;
  const scriptLocation = "/home/shubham/Code/system-scripts/get-subdomain.sh";
  // console.log("subdomain", statusId)
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  console.log(id);
  // Update the subdomain in the 'projects'
  pb.collection("projects")
    .update(projectId, { subdomain: newSubdomain })
    .then((output) => {
      console.log(output);
    })
    .catch((e) => {
      console.log(e);
    });

  // Update the subdomain in the 'subdomains'
  pb.collection("subdomains")
    .update(subdomainId, { name: newSubdomain })
    .then((output) => {
      console.log(output);
    })
    .catch((e) => {
      console.log(e);
    });

  // Create a nginx entry using custom script
  executeCommandChild(`sh`, [
    `${scriptLocation}`,
    `${newSubdomain}`,
    `${port}`,
    `${id}`,
  ])
    .then((output: any) => {
      log(chalk.blue("Nginx entry created ", output.stdout, output.stderr));

      // Remove nginx entry
      executeCommandChild("rm", [
        "-f",
        `/etc/nginx/techsapien.d/${id}/${currentSubdomain}.techsapien.dev.conf`,
      ]);

      // Reload nginx
      executeCommandChild("nginx", ["-s", `reload`]);

      res.status(200).json({ data: "created nginx entry.." });
    })
    .catch((e) => {
      log(chalk.redBright("Error creating nginx entry, please try again", e));
      res.status(400).json({ data: "" });
    });
}
