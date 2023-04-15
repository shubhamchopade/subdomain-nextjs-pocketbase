import type { NextApiRequest, NextApiResponse } from "next";
import { executeCommandChild } from "../../backend/node-multithreading";
import { createWebsiteUmami, loginUmami } from "../../backend/helpers/tracking";

const path = process.env.NEXT_PUBLIC_LOCAL_PATH_TO_PROJECTS;
const dir = `${path}/data/apps`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id = 1, projectId = 1 } = req.query;

  const data = await loginUmami();
  const { token } = data;

  const createRes = await createWebsiteUmami(token);
  const { websiteUuid } = createRes;

  // <script async defer data-website-id="e263b7d8-2048-4c74-8e3a-ae56a6a97afc" src="https://tracking.techsapien.dev/umami.js"></script>

  return res.status(200).json({ websiteUuid });
}
