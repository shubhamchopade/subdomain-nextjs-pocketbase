import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import React from "react";
import GithubRepos from "../../components/projects/GithubRepos";
import ProjectsGrid from "../../components/projects/ProjectsGrid";
import { listAuthMethods } from "../../components/utils/pocketbase-api-methods";
import { authOptions } from "../api/auth/[...nextauth]";
import Pocketbase from "pocketbase";

const Dashboard = () => {
  return (
    <div>
      <ProjectsGrid />
    </div>
  );
};

export default Dashboard;
