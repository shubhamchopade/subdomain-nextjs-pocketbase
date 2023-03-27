import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import React from "react";
import GithubRepos from "../components/projects/GithubRepos";
import ProjectsGrid from "../components/projects/ProjectsGrid";
import { listAuthMethods } from "../components/utils/pocketbase-api-methods";
import { authOptions } from "./api/auth/[...nextauth]";
import PocketBase from "pocketbase";

type Posts = {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: Post[];
};

type Post = {
  id: string;
  name: string;
  created: string;
  updated: string;
  isPublished: boolean;
  collectionId: string;
  collectionName: string;
};

const Dashboard = (
  // props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return (
    <div>
      <ProjectsGrid />
    </div>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  let session = null;
  let status = null;
  let data = null;

  const projectId = context.params?.project;

  try {
    const sessionRes = await getServerSession(
      context.req,
      context.res,
      authOptions
    );

    // Get project data
    const records = await pb.collection('projects').getOne(projectId);
    data = JSON.stringify({
      id: records.id,
      title: records.title,
      description: records.description,
      link: records.link,
      framework: records.framework,
      userId: records.userId,
      createdAt: records.createdAt,
      updatedAt: records.updatedAt,
      subdomain: records.subdomain,
    });


    // Get status
    const statusExists = await pb
      .collection("projectStatus")
      .getFullList({ projectId: projectId }, { $autoCancel: false })
    status = JSON.stringify({
      id: statusExists[0].id,
      status: statusExists[0].current,
      cloned: statusExists[0].cloned,
      installed: statusExists[0].installed,
      built: statusExists[0].built,
      stopped: statusExists[0].stopped,
      isOnline: statusExists[0].isOnline,
      timeElapsed: statusExists[0].timeElapsed,
      logClone: statusExists[0].logClone,
      logSubdomain: statusExists[0].logSubdomain,
      logInstall: statusExists[0].logInstall,
      logBuild: statusExists[0].logBuild,
      logStart: statusExists[0].logStart,
    })
    // console.log("GSSR ---------------", cookies);
    session = sessionRes;
  } catch (e) {
    console.log(e);
  }

  // console.log(resultList)

  if (session) {
    return {
      props: {
        user: session?.user,
        status,
        data,
      },
    };
  }

  return {
    props: {},
  };
};
