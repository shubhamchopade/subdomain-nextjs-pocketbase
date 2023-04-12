import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../backend/node-multithreading";
import PocketBase from "pocketbase";

const path = process.env.NEXT_PUBLIC_LOCAL_PATH_TO_PROJECTS;
const dir = `${path}/data/apps`;

export async function subdomainHelper(
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

  const scriptLocation = `${path}/scripts/get-subdomain.sh`;
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
      console.log(
        chalk.redBright("Error creating nginx entry, please try again")
      );
      // res.status(400).json({ data: "Error assinging subdomain" });
      return false;
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
              console.log(
                chalk.blue("Nginx entry created ", output.stdout, output.stderr)
              );
              // Update the status in the database
              pb.collection("projectStatus").update(statusId, {
                subdomain: true,
                current: "subdomain created",
                logSubdomain: `🔥 Subdomain assigned successfully - ${subdomain}.techsapien.dev`,
                isLoading: true,
              });
              // res.status(200).json({ data: "created nginx entry.." });
              return true;
            })
            .catch((e) => {
              // Error creating nginx entry
              pb.collection("projectStatus").update(statusId, {
                subdomain: true,
                current: "subdomain failed",
                logSubdomain:
                  "Uh Oh! Subdomain already assigned, please choose another one. 🤔",
                isLoading: false,
              });
              console.log(
                chalk.redBright(
                  "Error creating nginx entry, please try again",
                  e
                )
              );
              // res.status(400).json({ data: "Error assinging subdomain" });
              return false;
            });
        })
        .catch((err: any) => {
          console.log("error", err);
          // res.status(400).json({ data: "Error assinging subdomain, exited" });
          return false;
        });
    });
}

export async function installHelper(
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

  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  try {
    const output = await executeCommandChild("cd", [
      `${dir}/${id}/${projectId}`,
      `&&`,
      `sudo`,
      `yarn`,
      `install`,
    ]);
    const timeInstall = output.stdout.split("Done in ")[1].split("s")[0];
    // update the installed and logInstall in projectStatus
    await pb.collection("projectStatus").update(statusId, {
      installed: true,
      current: "installation complete",
      logInstall: JSON.stringify(output.stdout),
      isLoading: true,
    });
    // update the timeInstall in deployMetrics
    await pb.collection("deployMetrics").update(metricId, {
      timeInstall,
    });
    return "install success";
  } catch (err) {
    // update the installed and logInstall in projectStatus
    await pb.collection("projectStatus").update(statusId, {
      installed: false,
      current: "installation failed",
      logInstall: JSON.stringify(err.stderr),
      isLoading: false,
    });
    console.log(chalk.bgRed("--------install failed---------", err.stderr));
    return "install failed";
  }
}

export async function buildHelper(req: NextApiRequest, res: NextApiResponse) {
  const {
    link,
    id = 1,
    projectId = 1,
    port = 3,
    statusId,
    metricId,
  } = req.query;

  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  console.log("Build Started");

  try {
    const output = await executeCommandChild("cd", [
      `${dir}/${id}/${projectId}`,
      `&&`,
      `sudo`,
      `yarn`,
      `build`,
    ]);
    const timeBuild = output.stdout.split("Done in ")[1].split("s")[0];
    try {
      // get the disk usage of the project folder
      const data = await executeCommandChild("du", [
        "-sh",
        `${dir}/${id}/${projectId}`,
      ]);
      const diskUsage = data.stdout.split("\t")[0];
      // update value in diskUsage in projects collection
      await pb.collection("projects").update(projectId, {
        diskUsage,
      });
    } catch (e) {
      console.log(chalk.bgRed("error", e));
    }

    // update the built and logBuild in projectStatus
    await pb.collection("projectStatus").update(statusId, {
      built: true,
      current: "build complete",
      logBuild: JSON.stringify(output.stdout),
      isLoading: true,
    });
    // update the timeBuild in deployMetrics
    await pb.collection("deployMetrics").update(metricId, {
      timeBuild,
    });
    console.log(chalk.bgBlue("build output ", output.stdout, output.stderr));
    return "build success";
  } catch (err) {
    await pb.collection("projectStatus").update(statusId, {
      built: false,
      current: "build failed",
      logBuild: JSON.stringify(err.stderr),
      isLoading: false,
    });
    console.log(chalk.bgRed(`build failed for ${projectId}`, err.stderr));
    return "build failed";
  }
}

export async function startHelper(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { link, id = 1, projectId = 1, statusId, subdomain } = req.query;
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  try {
    // Get framework
    const project = await pb.collection("projects").getOne(projectId);
    const { port, framework } = project;
    console.log("port, framework", port, framework);

    await executeCommandChild(`systemctl`, [
      `enable`,
      `$(systemd-escape`,
      `--template`,
      `techsapien@.service`,
      `"${projectId} ${port} ${id} ${framework}")`,
    ]);
    const output = await executeCommandChild(`systemctl`, [
      `start`,
      `$(systemd-escape`,
      `--template`,
      `techsapien@.service`,
      `"${projectId} ${port} ${id} ${framework}")`,
    ]);

    console.log(
      "Service created - project online",
      output.stdout,
      output.stderr
    );
    await pb.collection("projects").update(projectId, {
      isOnline: true,
    });
    await pb.collection("projectStatus").update(statusId, {
      isOnline: true,
      stopped: false,
      current: "project online",
      logStart: `🎉 Project is ONLINE - ${subdomain}.techsapien.dev`,
      isLoading: false,
    });
  } catch (err) {
    console.log("Service create failed", err);
    await pb.collection("projectStatus").update(statusId, {
      isOnline: false,
      stopped: true,
      current: "project stopped",
      logStart: `👀 Project could not start, please try again later.`,
      isLoading: false,
    });
  }
}

// Get the screenshot of the project and save it to the location /home/shubham/Code/reactly/screenshots
// firefox --screenshot --window-size=1920,1080 <PATH_TO_SAVE_IMAGE> <URL>
export async function screenshotHelper(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { link, id = 1, projectId = 1, subdomain } = req.query;

  const scriptLocation = `${path}/scripts/screenshot.sh`;
  const screenshotsLocation = `${path}/data/screenshots`;

  // Create a directory for the project
  try {
    await executeCommandChild(`sudo -u shubham`, [
      "mkdir",
      `${screenshotsLocation}/${id}`,
    ]);
  } catch (err) {
    console.log("directory already exists");
  }

  // Timeout for the server to process the image
  await executeCommandChild(`sleep`, ["2"]);

  // Take the screenshot
  await executeCommandChild(`sudo -u shubham`, [
    `sh ${scriptLocation}`,
    `${id}`,
    `${projectId}`,
    `https://${subdomain}.techsapien.dev`,
  ]);

  return "screenshot taken";
}
