import { getServerSession } from 'next-auth';
import React from 'react'
import CreateProject from '../components/projects/Create';
import GithubRepos from '../components/projects/GithubRepos';
import { listAuthMethods } from '../components/utils/pocketbase-api-methods';
import { authOptions } from './api/auth/[...nextauth]';

const Create = (props) => {
    return (
        <div>  <GithubRepos /></div>
    )
}

export default Create

export const getServerSideProps = async (context) => {
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

    console.log(session)

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
