// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import PocketBase from "pocketbase";
import { executeCommandChild } from "../../../backend/node-multithreading";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { link, id = 1, projectId = 1, statusId, subdomain } = req.query;
  const dir = process.env.NEXT_PUBLIC_LOCAL_PATH_TO_PROJECTS;

  executeCommandChild("du", ["-sh", `${dir}/${id}/${projectId}`])
    .then((data) => {
      console.log("data", data);
      res.status(200).json({ data: data.stdout });
    })
    .catch((e) => {
      res.status(400).json({ data: e.stderr });
    });
}
