import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import React from "react";
import GithubRepos from "../../components/projects/GithubRepos";
import ProjectsGrid from "../../components/projects/ProjectsGrid";
import { listAuthMethods } from "../../components/utils/pocketbase-api-methods";
import { authOptions } from "../api/auth/[...nextauth]";
import Pocketbase from "pocketbase";

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

const Dashboard = () =>
  // props: InferGetServerSidePropsType<typeof getServerSideProps>
  {
    return (
      <div>
        <ProjectsGrid />
      </div>
    );
  };

export default Dashboard;
