import type { NextApiRequest, NextApiResponse } from "next";
import { cloneHelper } from "../../backend/helpers/clone";

/**
 * Clone api function first clones the repo and then detects the framework then returns
 * @param req link, id, projectId, port, statusId
 * @param res if success, update status to cloned
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  cloneHelper(req, res);
}
