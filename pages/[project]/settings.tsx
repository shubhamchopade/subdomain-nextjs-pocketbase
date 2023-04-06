import React from 'react'
import Subdomain from '../../components/projects/Subdomain'
import SecretsCard from '../../components/projects/SecretsCard'
import Link from 'next/link'
import { GetServerSideProps } from 'next'

// TODO
// Add a form to update the subdomain
// import SecretCard component
// Delete the project button

const Settings = (props) => {
    const { name, projectId } = props
    return (
        <main className='container mx-auto'>
            <div className='breadcrumbs'>
                <ul>
                    <li><Link href={"/dashboard"}>projects</Link></li>
                    <li><Link href={`/${projectId}`}>{name}</Link></li>
                    <li>settings</li>
                </ul>
            </div>
            <div className='max-w-xl mx-auto'>
                <Subdomain {...props} />
                <SecretsCard {...props} />
                <button className='btn btn-outline btn-error w-full'>Delete this project</button>

            </div>
        </main>
    )
}

export default Settings

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
    const projectId = context.params?.project;
    const name = context.query.name;
    return {
        props: {
            name,
            projectId
        },
    };
};
