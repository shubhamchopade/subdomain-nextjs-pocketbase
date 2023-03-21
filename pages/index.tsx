import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getServerSession, Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Octokit } from "octokit";
import pocketbaseEs from "pocketbase";
import { useEffect, useState } from "react";
import {
  authWithOauth2,
  listAuthMethods,
  listAuthMethodsResponse,
} from "../components/utils/pocketbase-api-methods";
import { useAuthState } from "../store/authState";
import styles from "../styles/Home.module.css";
import { authOptions } from "./api/auth/[...nextauth]";

type User = {
  expires: string;
  user: {
    email: string;
    image: string;
    name: string;
  };
};

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

const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  // const items = props?.posts?.items;
  // const user = props?.auth?.user;
  const router = useRouter();
  const { callbackUrl } = useRouter().query;
  const authState = useAuthState();

  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <div className={styles.container}>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Deploy your Nextjs App in seconds!</h1>
            <p className="py-6">
              We are powered with ultimate build power!
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

const getPosts = async () => {
  const res = await fetch(
    "https://pocketbase.techsapien.dev/api/collections/blogs/records"
  );
  const posts = await res.json();
  return posts;
};

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
      },
    };
  }

  return {
    props: {},
  };
};
