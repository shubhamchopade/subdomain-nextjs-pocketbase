import type { NextApiRequest, NextApiResponse } from "next";
import {
  buildHelper,
  installHelper,
  startHelper,
  subdomainHelper,
} from "../../backend/helpers/deploy";
import { screenshotHelper } from "../../backend/helpers/screenshot";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const subdomainRes = await subdomainHelper(req, res);
    console.log("subdomain -", subdomainRes);

    const installRes = await installHelper(req, res);
    console.log("install", installRes);

    const buildRes = await buildHelper(req, res);
    console.log("build", buildRes);

    if (buildRes === "build failed") {
      res.status(400).json({ data: "error building project" });
    }

    if (buildRes === "build success") {
      const startRes = await startHelper(req, res);

      const screenshotRes = await screenshotHelper(req, res);

      console.log("screenshot", screenshotRes);
      res.status(200).json({
        data: "Installation Complete",
      });
    }
  } catch (err) {
    res.status(400).json({ data: "error building project" });
  }
}
