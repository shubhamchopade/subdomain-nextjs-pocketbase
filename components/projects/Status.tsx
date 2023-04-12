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
        <div className="max-w-md mx-auto">
          <ul className="steps steps-vertical">
            <li
              data-content={`${status.cloned ? "✓" : "1"}`}
              className={`step ${status.cloned && "step-primary"}`}
            >
              Clone
            </li>
            {status.queued && (
              <li
                data-content={`${status.queued ? "✓" : "2"}`}
                className={`step ${status.queued && "step-primary"}`}
              >
                queued
              </li>
            )}
            <li
              data-content={`${status.subdomain ? "✓" : "2"}`}
              className={`step ${status.subdomain && "step-primary"}`}
            >
              Subdomain
            </li>
            <li
              data-content={`${
                status.installed ? "✓" : status.subdomain ? "●" : "3"
              }`}
              className={`step ${status.installed && "step-primary"}`}
            >
              Install
            </li>
            <li
              data-content={`${
                status.built ? "✓" : status.installed ? "●" : "4"
              }`}
              className={`step ${status.built && "step-primary"}`}
            >
              Build
            </li>
            <li
              data-content={`${
                status.isOnline ? "✓" : status.stopped ? "!" : "5"
              }`}
              className={`step ${
                status.isOnline
                  ? "step-primary"
                  : status.stopped
                  ? "step-error"
                  : ""
              }`}
            >
              Online
            </li>
          </ul>
        </div>

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
