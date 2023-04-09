import { NextApiRequest, NextApiResponse } from "next";
import { executeCommandChild } from "../node-multithreading";

// Get the screenshot of the project and save it to the location /home/shubham/Code/reactly/screenshots
// firefox --screenshot --window-size=1920,1080 <PATH_TO_SAVE_IMAGE> <URL>
export async function screenshotHelper(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { link, id = 1, projectId = 1, subdomain } = req.query;

  const scriptLocation = "/home/shubham/Code/system-scripts/screenshot.sh";

  // Create a directory for the project
  try {
    await executeCommandChild(`sudo -u shubham`, [
      "mkdir",
      `/home/shubham/Code/reactly/screenshots/${id}`,
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
