import type { NextApiRequest, NextApiResponse } from "next";
import { executeCommandChild } from "../../backend/node-multithreading";

const path = process.env.NEXT_PUBLIC_LOCAL_PATH_TO_PROJECTS;
const dir = `${path}/data/apps`;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id = 1, projectId = 1 } = req.query;
  const payload = req.body;
  const secrets = payload.data;
  // console.log(JSON.stringify(secrets));

  // Add the secrets to the .env file at project location dir/id/projectId
  executeCommandChild("cd", [
    `${dir}/${id}/${projectId}`,
    `&&`,
    `echo "${secrets}" | sudo tee .env`,
  ])
    .then((output: any) => {
      // console.log(output)
      res.status(200).json({ data: "Secrets added successfully" });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ data: "Secrets adding failed. Internal Server Error." });
    });
}
