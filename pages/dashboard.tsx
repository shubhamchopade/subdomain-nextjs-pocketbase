import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";
import UploadForm from "../components/common/UploadForm";
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
  const linkInit = "https://github.com/shubhamchopade/mutualisim_frontend.git";
  const [link, setLink] = React.useState(linkInit);
  const cloneRepo = async () => {
    const link = "https://github.com/shubhamchopade/mutualisim_frontend.git";
    const id = `1`;
    const projectId = `21`;
    const res = await fetch(
      `/api/clone?link=${link}&id=${id}&projectId=${projectId}`
    );
    const data = await res.json();
    console.log(data);
  };
  const installDependencies = async () => {
    const id = `1`;
    const projectId = `21`;
    const res = await fetch(
      `/api/install?link=${link}&id=${id}&projectId=${projectId}`
    );
    const data = await res.json();
    console.log(data);
  };
  const buildDependencies = async () => {
    const id = `1`;
    const projectId = `20`;
    const res = await fetch(
      `/api/build?link=${link}&id=${id}&projectId=${projectId}`
    );
    const data = await res.json();
    console.log(data);
  };
  const startProject = async () => {
    const id = `1`;
    const projectId = `20`;
    const res = await fetch(
      `/api/start?link=${link}&id=${id}&projectId=${projectId}`
    );
    const data = await res.json();
    console.log(data);
  };
  return (
    <div>
      <div className="card w-96 mx-auto bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Create Project</h2>
          <p>Please paste your github link here</p>

          <input
            type="text"
            className="input input-bordered"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <div className="card-actions justify-end">
            <button onClick={cloneRepo} className="btn btn-primary">
              CLONE
            </button>
            <button onClick={installDependencies} className="btn btn-primary">
              INSTALL
            </button>
            <button onClick={buildDependencies} className="btn btn-primary">
              BUILD
            </button>
            <button onClick={startProject} className="btn btn-accent">
              START
            </button>
          </div>
        </div>
      </div>
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
