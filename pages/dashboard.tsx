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
  return (
    <div>
      <div className="card w-96 mx-auto bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Create Project</h2>
          <p>Choose the files you want to upload?</p>
          <div className="card-actions justify-end">
            <UploadForm />
            <button className="btn btn-primary">upload</button>
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
