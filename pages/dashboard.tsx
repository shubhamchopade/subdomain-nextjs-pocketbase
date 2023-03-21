import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";
import { ToastContainer } from "react-toastify";
import UploadForm from "../components/common/UploadForm";
import UserCard from "../components/common/UserCard";
import CreateProject from "../components/projects/Create";
import ProjectsGrid from "../components/projects/ProjectsGrid";
import { listAuthMethods } from "../components/utils/pocketbase-api-methods";
import { useAuthState } from "../store/authState";
import { authOptions } from "./api/auth/[...nextauth]";

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
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  // console.log(props)
  return (
    <div>
      <CreateProject auth={props} />
      <ProjectsGrid auth={props} />
    </div>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/api/collections/blogs/records`
  );

  const methods = await listAuthMethods();
  const posts: Posts = await res.json();
  let session = null;

  try {
    const sessionRes = await getServerSession(
      context.req,
      context.res,
      authOptions
    );
    console.log("GSSR ---------------", sessionRes.user);
    session = sessionRes;
  } catch (e) {
    console.log(e);
  }

  if (session) {
    return {
      props: {
        user: session.user,
        token: session.token,
        posts,
      },
    };
  }

  return {
    props: {},
  };
};
