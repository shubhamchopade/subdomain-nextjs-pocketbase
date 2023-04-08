import type { NextApiRequest, NextApiResponse } from "next";
import {
  buildHelper,
  installHelper,
  startHelper,
  subdomainHelper,
} from "../../backend/helpers/deploy";

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

    const startRes = await startHelper(req, res);
    console.log("start", startRes);

    res.status(200).json({
      data: "Installation Complete",
      logs: JSON.stringify(installRes),
    });
  } catch (err) {
    res.status(400).json({ data: "error building project" });
  }
}