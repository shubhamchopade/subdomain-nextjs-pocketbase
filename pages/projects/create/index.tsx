import { getServerSession } from "next-auth";
import React from "react";
import GithubRepos from "../../../components/projects/GithubRepos";
import { authOptions } from "../../api/auth/[...nextauth]";

const Create = (props: any) => {
  return (
    <div className="h-screen">
      {" "}
      <GithubRepos />
    </div>
  );
};

export default Create;

export const getServerSideProps = async (context: any) => {
  let session = null;
  try {
    const sessionRes = await getServerSession(
      context.req,
      context.res,
      authOptions
    );
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
