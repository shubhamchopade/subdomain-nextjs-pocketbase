import React, { useEffect } from 'react'
import PocketBase from 'pocketbase'
import Card from './Card';

// Fetch all the projects

const ProjectsGrid = (props) => {
    const pb = new PocketBase('https://pocketbase.techsapien.dev');
    const [allProjects, setAllProjects] = React.useState([])

    const user = props?.auth?.user

    useEffect(() => {
        const getProjects = async () => {
            const records = await pb.collection('projects').getFullList({
                userId: user?.id
            }, { $autoCancel: false });
            setAllProjects(records)
            // console.log(records)
        }

        getProjects()
    }, [])

    return (
        <div className='flex flex-wrap'>{allProjects && allProjects.map(project => (
            <Card user={user} key={project.id} project={project} />
        ))}</div>
    )
}

export default ProjectsGrid