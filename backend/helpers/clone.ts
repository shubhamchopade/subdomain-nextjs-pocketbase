import type { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";
import { executeCommandChild } from "../../backend/node-multithreading";
import PocketBase from "pocketbase";

export function cloneHelper(req: NextApiRequest, res: NextApiResponse<any>) {
  const { link, id = 1, projectId = 1, port = 3, statusId } = req.query;
  const dir = process.env.NEXT_PUBLIC_LOCAL_PATH_TO_PROJECTS;
  const projectPath = `${dir}/${id}/${projectId}`;
  const scriptLocation = "/home/shubham/Code/system-scripts/get-framework.sh";
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  try {
    executeCommandChild(`git`, [
      "clone",
      `${link}`,
      `${dir}/${id}/${projectId}`,
    ])
      .then((childRes: any) => {
        pb.collection("projectStatus").update(statusId, {
          current: "cloned",
          cloned: true,
          logClone: "cloned successfully",
        });

        // get the framework of the project using the script
        executeCommandChild(`sh`, [
          `${scriptLocation}`,
          `${dir}/${id}/${projectId}`,
        ])
          .then((output: any) => {
            console.log(
              chalk.bgGreenBright.black(
                "framework detected ",
                output.stdout,
                output.stderr
              )
            );

            const framework = output.stdout;
            // Update the framework in the database
            pb.collection("projects").update(projectId, { framework });

            if (framework === "no match\n") {
              console.log(chalk.redBright("unsupported framework detected"));
              // Update the status in the database
              pb.collection("projectStatus").update(statusId, {
                current: "unsupported framework",
                cloned: true,
                logClone: "cloned successfully",
              });

              // delete the project files from /app
              executeCommandChild("rm", ["-rf", projectPath]);

              // delete from pocketbase
              pb.collection("projects").delete(projectId);

              // Return the error response
              res
                .status(400)
                .json({ message: `unsupported framework detected` });
            }

            // Return the success response
            res.status(200).json({
              data: `Repo cloned ${link}`,
              logs: JSON.stringify(childRes.stdout),
            });
          })
          .catch((e) => {
            console.log(chalk.redBright("unsupported framework detected", e));
          });
      })
      .catch((err) => {
        console.log(chalk.bgRed("git clone skipped", err.stderr));
        // Update the status in the database
        pb.collection("projectStatus").update(statusId, {
          current: "clone skipped",
          cloned: true,
          logClone: "git clone skipped, file already exists",
        });
        // Return the error response
        res.status(400).json({ data: `git clone failed, file already exists` });
      });
  } catch (e) {
    console.error(e);
    // Update the status in the database
    pb.collection("projectStatus").update(statusId, {
      current: "clone failed",
      cloned: false,
      logClone: "git clone failed, file already exists",
    });
    // Return the error response
    res.status(400).json({ data: `git clone failed, file already exists` });
  }
}
