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
  const items = props?.posts?.items;
  const user = props?.auth?.user;
  const router = useRouter();
  const { callbackUrl } = useRouter().query;
  const authState = useAuthState();

  console.log(authState.user, authState.token);

  const [githubAuth, setGithubAuth] = useState();

  const authUrl = props?.methods?.authProviders[0]?.authUrl;
  const codeVerifier = props?.methods?.authProviders[0]?.codeVerifier;
  const name = props?.methods?.authProviders[0]?.name;

  useEffect(() => {
    // if (authUrl && !router.query.code) {
    //   router.push(authUrl);
    // }
    // async function signIn() {
    //   if (router.query.code && authUrl && !githubAuth) {
    //     const code = router.query.code.toString();
    //     console.log("code", code);
    //     const githubAuthData = await authWithOauth2({
    //       provider: name,
    //       code,
    //       codeVerifier,
    //       redirectUrl: "http://localhost:3000",
    //     });
    //     if (githubAuthData?.error) {
    //       console.log("error", githubAuthData.error);
    //       return;
    //     }
    //     setGithubAuth(githubAuthData);
    //     authState.setUser(githubAuthData.meta);
    //     authState.setToken(githubAuthData.token);
    //     router.push("/");
    //     console.log("INSIDE -----", githubAuthData);
    //   }
    // }
    // signIn();
  }, []);

  const handleSignin = async () => {
    signIn("github", { redirect: false, callbackUrl });
  };
  const handleSignOut = async () => {
    signOut({ redirect: true, callbackUrl: "/" });
  };

  console.log(githubAuth);

  return (
    <div>
      {/* {data.map((d) => (
          <p key={d.id}>{d.name}</p>
        ))} */}
      <h1>{user?.name}</h1>
      <h1>{user?.email}</h1>
      <Image width={100} height={100} src={user?.image} alt="asd" />
      {githubAuth ? (
        <button onClick={handleSignOut}>SIGN OUT</button>
      ) : (
        <button onClick={handleSignin}>SIGNIN</button>
      )}
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

export const getServerSideProps: GetServerSideProps<{
  auth: Session;
  posts: Posts;
  methods: listAuthMethodsResponse;
}> = async (context) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/api/collections/blogs/records`
  );

  const methods = await listAuthMethods();
  const posts: Posts = await res.json();

  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    return {
      props: {
        auth: session,
        posts,
        methods,
      },
    };
  }

  return {
    props: {},
  };
};
