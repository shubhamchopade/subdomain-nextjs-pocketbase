import React, { useEffect, useState } from 'react'
import PocketBase from 'pocketbase'
import Card from './Card';
import Link from 'next/link';

// Fetch all the projects

const ProjectsGrid = () => {
    const [allProjects, setAllProjects] = React.useState([])
    const [_userId, setUserId] = useState("")

    useEffect(() => {
        const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
        const auth = localStorage.getItem("pocketbase_auth")
        const json = JSON.parse(auth)
        const userId = json?.model?.id
        setUserId(userId)
        const getProjects = async () => {
            const records = await pb.collection('projects').getFullList({
                userId
            }, { $autoCancel: false });
            setAllProjects(records)
            // console.log(records)
        }

        getProjects()
    }, [])

    // console.log(allProjects)

    return (
        <main className='container mx-auto'>
            <div className='breadcrumbs'>
                <ul>
                    <li><Link href={"/projects"}>Projects</Link></li>
                </ul>
            </div>
            <div className='max-w-4xl mx-auto '>
                {allProjects.length === 0 && <div className='text-center flex justify-center items-center'>
                    <div>
                        <h1>This looks empty! Create your first project.</h1>
                    </div>
                </div>}
                <div className='flex flex-wrap'>{allProjects && allProjects.map(project => (
                    <Card userId={_userId} key={project.id} project={project} />
                ))}</div>
            </div>
        </main>
    )
}

export default ProjectsGrid