import { getServerSession } from "next-auth";
import React from "react";
import GithubRepos from "../../../components/projects/GithubRepos";
import { authOptions } from "../../api/auth/[...nextauth]";
import PocketBase from "pocketbase";

const Create = (props: any) => {
  // console.log(props);
  return (
    <div className="h-screen">
      {" "}
      <GithubRepos />
    </div>
  );
};

export default Create;

export const getServerSideProps = async (context: any) => {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  let session = null;

  try {
    const sessionRes = await getServerSession(
      context.req,
      context.res,
      authOptions
    );
    const email = sessionRes?.user.email;

    // console.log("GSSR ---------------", user);
    // console.log("GSSR ---------------", sessionRes.user);
    session = sessionRes;
  } catch (e) {
    console.log(e);
  }

  if (session) {
    return {
      props: {
        user: session?.user,
      },
    };
  }

  return {
    props: {},
  };
};
