import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import React from "react";
import GithubRepos from "../../components/projects/GithubRepos";
import ProjectsGrid from "../../components/projects/ProjectsGrid";
import { listAuthMethods } from "../../components/utils/pocketbase-api-methods";
import { authOptions } from "../api/auth/[...nextauth]";
import Pocketbase from "pocketbase";

const Dashboard = () => {
  const handleLogin = async () => {
    const data = await fetch("/api/tracking");
    const data2 = await data.json();
    console.log(data2);
  };
  return (
    <div>
      {/* <button onClick={handleLogin}>Login Umami</button> */}
      <ProjectsGrid />
    </div>
  );
};

export default Dashboard;
