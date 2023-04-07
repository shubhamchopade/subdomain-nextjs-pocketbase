import React from 'react'
import Subdomain from '../../../components/projects/Subdomain'
import SecretsCard from '../../../components/projects/SecretsCard'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import PocketBase from "pocketbase";

const Settings = (props) => {
    const data = JSON.parse(props.data)
    const { title: name, id: projectId } = data
    // console.log(projectData)
    return (
        <main className='container mx-auto'>
            <div className='breadcrumbs'>
                <ul>
                    <li><Link href={"/projects"}>projects</Link></li>
                    <li><Link href={`/projects/${projectId}`}>{name}</Link></li>
                    <li>settings</li>
                </ul>
            </div>
            <div className='max-w-xl mx-auto'>
                <Subdomain {...data} />
                <SecretsCard {...data} />
                <button className='btn btn-outline btn-error w-full'>Delete this project</button>

            </div>
        </main>
    )
}

export default Settings

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    const projectId = context.params?.project;
    const name = context.query.name;
    const id = context.query.id;
    const statusId = context.query.statusId;
    const framework = context.query.framework;
    const port = context.query.port;
    let data = null

    try {

        // Get project data
        const records = await pb.collection('projects').getOne(projectId);
        data = JSON.stringify({
            id: records.id,
            title: records.title,
            description: records.description,
            link: records.link,
            framework: records.framework,
            userId: records.userId,
            createdAt: records.createdAt,
            updatedAt: records.updatedAt,
            subdomain: records.subdomain,
            port: records.port,
        });

    } catch (e) {
        console.log(e)
    }


    return {
        props: {
            data
        },
    };


};
