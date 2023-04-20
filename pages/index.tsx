"use-client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";
import { listAuthMethods } from "../components/utils/pocketbase-api-methods";
import styles from "../styles/Home.module.css";
import { authOptions } from "./api/auth/[...nextauth]";

const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();
  const authUrl = props?.methods?.authProviders[0]?.authUrl;
  const codeVerifier = props?.methods?.authProviders[0]?.codeVerifier;
  const name = props?.methods?.authProviders[0]?.name;
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const code = router?.query?.code?.toString();
  const redirectUrl = process.env.NEXTAUTH_URL;

  console.log(code);
  const handleSignin = async () => {
    signIn("github", { redirect: true, callbackUrl: "/" });
  };

  useEffect(() => {
    if (authUrl && !code) {
      router.replace(authUrl);
    } else {
      signIn();
    }

    async function signIn() {
      try {
        if (router.query.code && authUrl) {
          const authData = await pb
            .collection("users")
            .authWithOAuth2(
              name,
              code,
              codeVerifier,
              "https://www.reactly.app"
            );
          console.log(authData);
          if (authData) {
            const data = {
              accessToken: authData?.meta?.accessToken,
              name: authData?.meta?.name,
              username: authData?.meta?.username,
              userId: authData?.record?.id,
            };

            // Update the access token when the user signs in using Github
            try {
              const gmeta = await pb
                .collection("githubUserMeta")
                .getFirstListItem(`userId="${authData?.record?.id}"`);

              // update
              const ghub = await pb
                .collection("githubUserMeta")
                .update(gmeta.id, data);
            } catch (e) {
              // create
              try {
                const ghub = await pb.collection("githubUserMeta").create(data);
              } catch (e) {
                console.log(e);
              }
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">
              Deploy your React App in seconds!
            </h1>
            <p className="py-6">
              {/* Give me a description on my hero page */}
            </p>
            {props.user ? (
              <Link
                className={`btn btn-primary mx-4`}
                href={"/projects/create"}
              >
                Deploy now
              </Link>
            ) : (
              <button className="btn btn-primary" onClick={handleSignin}>
                Deploy now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  const methods = await listAuthMethods();
  let session = null;

  try {
    const sessionRes = await getServerSession(
      context.req,
      context.res,
      authOptions
    );
    // console.log("GSSR ---------------", sessionRes);
    session = sessionRes;
  } catch (e) {
    console.log(e);
  }

  // console.log("GITHUB", session)

  if (session) {
    return {
      props: {
        methods,
        user: session?.user,
        // token: session?.token,
      },
    };
  }

  return {
    props: {},
  };
};
