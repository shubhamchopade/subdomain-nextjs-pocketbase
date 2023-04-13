import React, { useEffect } from "react";
import PocketBase from "pocketbase";

const Status = (props) => {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const { status, setStatus } = props;
  const statusId = status?.id;

  useEffect(() => {
    try {
      if (statusId) {
        pb.collection("projectStatus").subscribe(statusId, function (e) {
          setStatus(e.record);
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [statusId]);

  return (
    <div>
      <div className="flex items-start justify-center">
        <div className="prose card bg-base-300 p-4 max-w-xl mx-auto shadow text-xs overflow-x-auto w-full">
          <pre>{status.logClone}</pre>
          <pre>{status.logSubdomain}</pre>
          <pre>{status.logInstall && JSON.parse(status.logInstall)}</pre>
          <pre>{status.logBuild && JSON.parse(status.logBuild)}</pre>
          <pre>{status.logStart}</pre>
        </div>
      </div>
    </div>
  );
};

export default Status;
