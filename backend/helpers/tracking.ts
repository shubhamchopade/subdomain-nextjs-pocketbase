// reactly.app uses umami for analytics

import { executeCommandChild } from "../node-multithreading";
import PocketBase from "pocketbase";

const API_URL = "https://u.techsapien.dev/api";
const path = process.env.NEXT_PUBLIC_LOCAL_PATH_TO_PROJECTS;
const dir = `${path}/data/apps`;
const scriptLocation = `${path}/scripts/add-tracking.sh`;

export const loginUmami = async () => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "shubhamchopade10@gmail.com",
      password: "SyracuseBoston#1997",
    }),
  });
  const data = await res.json();
  return data;
};

/**
 * Create a website in umami
 * @param token access token
 * @param domain domain name
 * @param name project name
 * @returns websiteUuid, shareId, name
 */
export const createWebsiteUmami = async (
  subdomain: string,
  projectId: string
) => {
  // Login to get the token
  const { token } = await loginUmami();
  const domain = `${subdomain}.reactly.app`;

  const createRes = await fetch(`${API_URL}/websites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      domain,
      name: subdomain,
      enableShareUrl: true,
    }),
  });

  const { websiteUuid, shareId } = await createRes.json();

  const trackingUrl = `https://u.techsapien.dev/share/${shareId}/${subdomain}`;

  // Update the respective project in the pocketbase
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  await pb.collection("projects").update(projectId, {
    trackingId: websiteUuid,
    trackingShareId: shareId,
  });

  return { websiteUuid, shareId, subdomain };
};

export const injectTrackingCode = async (
  id: string,
  projectId: string,
  subdomain: string,
  framework: string
) => {
  // Creates a website in umami, updates the details to pocketbase
  const createRes = await createWebsiteUmami(subdomain, projectId);
  const { websiteUuid, shareId } = createRes;
  // console.log("createRes", websiteUuid, shareId);

  // inject a script file in the _app.tsx file
  try {
    const d = await executeCommandChild(`sh`, [
      `${scriptLocation}`,
      `${dir}/${id}/${projectId}`,
      websiteUuid,
      framework,
    ]);
    console.log("Tracking code injected", d);
  } catch (e) {
    console.log("TRACKING ADD FAILED", e);
  }

  return {
    data: "code injected",
  };
};

export const updateWebsiteUmami = async (
  websiteUuid: string | string[] | undefined,
  subdomain: string | string[] | undefined
) => {
  const { token } = await loginUmami();
  const domain = `${subdomain}.reactly.app`;
  const createRes = await fetch(`${API_URL}/websites/${websiteUuid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      domain,
      name: subdomain,
      enableShareUrl: true,
    }),
  });
  const data = await createRes.json();
  return data;
};

export const deleteWebsiteUmami = async (
  websiteUuid: string | string[] | undefined
) => {
  const { token } = await loginUmami();

  const res = await fetch(`${API_URL}/websites/${websiteUuid}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data;
};
